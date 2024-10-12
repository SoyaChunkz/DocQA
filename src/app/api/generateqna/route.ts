import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";
import { QNAgeneratorValidator } from "@/lib/validators/SendMessageValidator";
import { openai } from "@/lib/openai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import{ OpenAIStream, StreamingTextResponse } from "ai"
import { record } from "zod";



export const POST = async (req: NextRequest) => {
    // Extract the request body
    const body = await req.json();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const { id: userId } = user;
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { fileId, numQuestions, questionType } = QNAgeneratorValidator.parse(body)

  // Validate file ownership
  const file = await db.file.findFirst({
    where: { id: fileId, userId },
  });


  if (!file) return new Response('Not found', { status: 404 });


    // connect to pinecone
    console.log("connecting to pinecone client");
    const pinecone = getPineconeClient(); 
    const pineconeIndex = pinecone.Index('docqa')


    const rs = await pineconeIndex.namespace(fileId).listPaginated({
        prefix: `${fileId}`
    })

    console.log("Response from Pinecone: ", rs);

    const ids: string[] = [];

    if (rs.vectors) {
        for (let index = 0; index < rs.vectors.length; index++) {
            // @ts-expect-errorts
            ids.push(rs.vectors[index].id); // Accessing id property of each vector
        }
    }
    
    // Log the collected IDs
    console.log("Collected IDs:", ids);

    const results = await pineconeIndex.namespace(fileId).fetch(ids)

    console.log(results)

    const pageContents = Object.values(results.records)
        .map(record => record.metadata?.pageContent) // Extract the pageContent
        .filter(content => content !== undefined); // Filter out undefined values
                                                                                                                                        
    // Join the page contents with double new lines for better separation
    const context = pageContents.join('\n\n');

    console.log(context)

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        stream: true,
        messages: [
          {
            role: 'system',
            content:
              'Use the following pieces of context to answer the users question in markdown format.',
          },
          {
            role: 'user',
            content: `Use the following pieces of context to answer the user's question in proper format. 

      If you don't know the answer, just say that you don't know, don't try to make up an answer. Try to avoid unnecessary spacings and special cahracters like * or #
      
      ----------------
      CONTEXT: ${context}
      
      ----------------
      USER INPUT: Generate ${numQuestions} Questions and Answers of type ${questionType}
      
      ----------------
      ${
        questionType.trim().toLowerCase() === 'subjective' ? 
        `Each subjective question should be followed by an answer that is at least 8 lines long. 
         Format the output as follows:
      
         Question: [The question here]
      
         Answer: [The detailed answer here, at least 8 lines long]` 

         : 

        `Each question should include four options, the correct answer, and a short explanation of why that answer is correct. 
         Format the output as follows:
      
         Question: [The question here]
      
         Options:
         1. [Option A]
         2. [Option B]
         3. [Option C]
         4. [Option D]
        
         Answer: [The correct answer here]
        
         Explanation: [A short explanation for the correct answer (1 or 2 lines)]`
      }`
          },
        ],
      });
      

    // @ts-ignore
    const stream = OpenAIStream(response, {
        async onCompletion(completion){
            console.log(response) 
        }
      })

    return new StreamingTextResponse(stream); 
}