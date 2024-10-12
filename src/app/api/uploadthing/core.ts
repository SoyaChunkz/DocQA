import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { getPineconeClient } from '@/lib/pinecone'
// import { getUserSubscriptionPlan } from '@/lib/stripe'
// import { PLANS } from '@/config/stripe'

const f = createUploadthing()

const middleware = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) throw new Error('Unauthorized')

//   const subscriptionPlan = await getUserSubscriptionPlan()

//   return { subscriptionPlan, userId: user.id }
  return {  userId: user.id }
}

const onUploadComplete = async ({
  metadata,
  file,
}
: {
  metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string
    name: string
    url: string
  }
}
) => {

  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  })

  if (isFileExist) return

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://utfs.io/f/${file.key}`,
      uploadStatus: 'PROCESSING',
    },
  })

  try {
    console.log("getting file")
    const response = await fetch(
      `https://utfs.io/f/${file.key}`
    )
    console.log("got file")
    
    const blob = await response.blob();
    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();
    const pagesAmt = pageLevelDocs.length;
    console.log(`Loaded ${pagesAmt} pages from PDF.`);
    console.log(pageLevelDocs);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await textSplitter.splitDocuments(pageLevelDocs);

    console.log(chunks);

    // Vectorize and index entire document
    console.log("connecting to pinecone client");
    const pinecone = getPineconeClient(); 
    const pineconeIndex = pinecone.Index('docqa')

    console.log("got pinecone index", pineconeIndex);


    // Using OPENAI
    const openaiEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    })
    console.log("OPENAI embeddings initialised")

    if (!openaiEmbeddings) {
      console.log('Failed to initialize openai. Check your API key.');
    }

    console.log("creating embeddings")

    const embeddingsArray: number[][] = await openaiEmbeddings.embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );

    console.log("got embeddings")

    console.log(embeddingsArray.length)
    console.log(embeddingsArray)

    interface Vector {
      id: string; 
      values: number[];
      metadata: {
          loc?: string; 
          pageContent?: string; 
          pdf?: string;
      };
  }

    const batchSize = 100;
    let batch: Vector[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = embeddingsArray[i];
      const vector = {
        id: `${createdFile.id}_${i + 1}`,
        values: embedding,
        metadata: {
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          pdf: JSON.stringify(chunk.metadata.pdf),
        }
      }
      batch.push(vector)

      if( batch.length === batchSize || i === chunks.length - 1 ){
        await pineconeIndex.namespace(createdFile.id).upsert(
          batch,
        )
        batch = [];
      }
    }
    
    // await PineconeStore.fromDocuments(
    //   docs,
    //   embeddings,
    //   {
    //     pineconeIndex, 
    //     namespace: createdFile.id,
    //   }
    // )

    await db.file.update({
      data: {
        uploadStatus: 'SUCCESS',
      },
      where: {
        id: createdFile.id,
      },
    })
  } catch (err) {
    console.log('Error processing the PDF:', err);
    await db.file.update({
      data: {
        uploadStatus: 'FAILED',
      },
      where: {
        id: createdFile.id,
      },
    })
  }
}

export const ourFileRouter = {
  pdfUploader: f({ pdf: {maxFileSize: '4MB'} })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  freePlanUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter