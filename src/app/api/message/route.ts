import { db } from "@/db"
import { openai } from "@/lib/openai"
import { getPineconeClient } from "@/lib/pinecone"
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import { NextRequest } from "next/server"
import{ OpenAIStream, StreamingTextResponse } from "ai"

export const POST = async (req: NextRequest) => {

    // endpoint for asking a question to a pdf file
    const body = await req.json();
  
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    const { id: userId } = user
  
    if (!userId)
      return new Response('Unauthorized', { status: 401 })
  
    const { fileId, message } = SendMessageValidator.parse(body)
   
    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    })
  
    if (!file)
      return new Response('Not found', { status: 404 })
  
    await db.message.create({
      data: { 
        text: message,
        isUserMessage: true,
        userId,
        fileId,
      },
    })

    console.log(fileId)

    // vectorize the message
    const openaiEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    })
    console.log("OPENAI embeddings initialised")

    // connect to pinecone
    console.log("connecting to pinecone client");
    const pinecone = getPineconeClient(); 
    const pineconeIndex = pinecone.Index('docqa')

    // const vectorStore = await PineconeStore.fromExistingIndex(
    //   openaiEmbeddings,
    //   {
    //     pineconeIndex,
    //     namespace: fileId,
    //   }
    // )

    const embeddingsArray: number[][] = await openaiEmbeddings.embedDocuments([message]);

    console.log(embeddingsArray)
    console.log("\n")
    console.log(embeddingsArray[0])

    
    // const results = await vectorStore.similaritySearch(message, 4);

    const results = await pineconeIndex.namespace(fileId).query({
       topK: 3, 
       vector: embeddingsArray[0],
       includeMetadata: true
      })

    console.log(results)


    const prevMessage = await db.message.findMany({
      where: {
        fileId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 6
    })

    const formattedPrevMessages = prevMessage.map((msg) => ({
      role: msg.isUserMessage ? "user" as const : "assistant" as const,
      content: msg.text,
    }))

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
        },
        {
          role: 'user',
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
          
      \n----------------\n
    
        PREVIOUS CONVERSATION:
        ${formattedPrevMessages.map((message) => {
                if (message.role === 'user')
                  return `User: ${message.content}\n`
                return `Assistant: ${message.content}\n`
        })}
    
      \n----------------\n
    
      CONTEXT:
      ${results.matches.map((r) => r.metadata?.pageContent).join('\n\n')}
  
      USER INPUT: ${message}`,
  
        },
      ],
    })
    
    // @ts-ignore
    const stream = OpenAIStream(response, {
      async onCompletion(completion){
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId,
          }
        })
      }
    })

    return new StreamingTextResponse(stream); 
}