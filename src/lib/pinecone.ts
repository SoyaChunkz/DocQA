import { Pinecone } from '@pinecone-database/pinecone';
import { string } from 'zod';

export const getPineconeClient = () => {
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: 'us-east1-aws', // Your Pinecone environment
  });

  return client;
};
