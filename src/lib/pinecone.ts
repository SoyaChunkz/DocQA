// import { Pinecone } from '@pinecone-database/pinecone';

// export const createPineconeIndex = async () => {
//     const pc = new Pinecone({
//         apiKey: process.env.PINECONE_API_KEY!,
//         environment: 'us-east-1-aws',
//     });

//     const indexName = 'docqa';

//     await pc.createIndex({
//         name: indexName,
//         dimension: 1536,
//         metric: 'cosine',
//     });

//     console.log(`Index ${indexName} created successfully.`);
// };

// createPineconeIndex().catch(console.error);


// export const getPineconeClient = () => {
//   return new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY!, // Ensure your Pinecone API key is set in environment variables
//       environment: 'us-east-1-aws', // Specify the correct environment
//   });
// };



import { PineconeClient } from '@pinecone-database/pinecone'

export const getPineconeClient = async () => {
  const client = new PineconeClient()

  await client.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: 'us-east-1-aws',
  })

  return client
}
