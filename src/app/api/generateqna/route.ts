import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";
import { QNAgeneratorValidator } from "@/lib/validators/SendMessageValidator";
import { parseQnaEntries } from "@/lib/parseQnaEntries";
import { openai } from "@/lib/openai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import{ OpenAIStream, StreamingTextResponse } from "ai"
import { record } from "zod";
import { QuestionType } from "@prisma/client";



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
              content: 'Use the following pieces of context to answer the user\'s question in a precise format.',
          },
          {
              role: 'user',
              content: `Use the following pieces of context to answer the user's question in the specified format.
  
              If you don't know the answer, just say that you don't know. Please avoid unnecessary spacing and special characters like * or #.
              
              ----------------
              CONTEXT: ${context}
              
              ----------------
              USER INPUT: Generate ${numQuestions} Questions and Answers of type ${questionType}.
              
              ----------------
              ${
                  questionType.trim().toLowerCase() === 'subjective' ?
                  `Each subjective question should be followed by an answer that is at least 10 lines long. 
                   Format the output in aescending order of question numbers as follows:
              
                   Q [number]. : [The question here]
              
                   Ans: [The detailed answer here, at least 10 lines long]
                   Include this [##############] as a delimiter after each question` 
                  : 
                  `Each question should include four options, the correct answer, and a short explanation of why that answer is correct. 
                   Format the output as follows:
              
                   Q [number]. : [The question here]
              
                   Options:
                   1. [Option A]
                   2. [Option B]
                   3. [Option C]
                   4. [Option D]
                  
                   Ans: [The correct answer here]
                  
                   Explanation: [A short explanation for the correct answer (1 or 2 lines)]
                   Include this [##############] as a delimiter after each question `
              }`
          },
      ],
  });
  
  console.log(fileId, numQuestions, questionType)

  function getQuestionType(type: string): QuestionType | null {
    switch (type.toLowerCase()) {
        case 'subjective':
            return QuestionType.SUBJECTIVE;
        case 'mcq':
            return QuestionType.MCQ;
        default:
            throw new Error(`Invalid question type: ${type}`);
    }
}

// @ts-ignore
const questionTypeEnum: QuestionType = getQuestionType(questionType);


  console.log(response)

    // @ts-ignore
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
          const qnaEntries = parseQnaEntries(completion, questionType as "subjective" | "mcq");

          console.log("From route.ts: ", qnaEntries)

          // Create a QnaSet entry
          let qnaSetId;
          try {
              const qnaSet = await db.qnaSet.create({
                  data: {
                      userId,
                      fileId,
                  }
              });
              if (qnaSet && typeof qnaSet.id === "string") {
                qnaSetId = qnaSet.id; // Save the QnaSet ID for later use
            } else {
                console.warn("QnaSet created but ID is not valid. Assigning undefined to qnaSetId.");
                qnaSetId = ''; // Assign undefined if ID is not valid
            }
          } catch (dbError) {
              console.error("Error creating QnaSet:", dbError);
              // Optionally, handle the error (e.g., send a response indicating failure)
          }

          // Iterate over each QnA entry and create a Qna entry
          for (const entry of qnaEntries) {
              try {
                  await db.qna.create({
                      data: {
                          question: entry.question,
                          answer: entry.answer,
                          questionType: questionTypeEnum,
                          options: entry.options || [], 
                          explanation: entry.explanation || null, 
                          qnaSetId: qnaSetId || '', // Link to the created QnaSet, or null if creation failed
                      }
                  });
              } catch (entryError) {
                  console.error("Error creating QnA entry:", entryError);
                  // Handle the error for individual QnA entries if needed
              }
          }
      }
  });


    return new StreamingTextResponse(stream); 
}
