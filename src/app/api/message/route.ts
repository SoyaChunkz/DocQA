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
          "Use the provided context (or previous conversation if necessary) to answer the user's question in Markdown format. Ensure the response includes explicit newline characters (`\\n`) for proper rendering.",
      },
      {
        role: 'user',
        content: `Use the provided context (or previous conversation if necessary) to answer the user's question.

        Return the response in **proper Markdown format** with **explicit newline characters ('\\n')** for correct rendering. **DO NOT** omit newlines between paragraphs, headings, or list items.

        If you don’t know the answer, say "I don’t know" instead of making up information.

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
      console.log(completion)
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