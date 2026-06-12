import OpenAI from 'openai'

// Instantiated lazily so importing this module doesn't throw at build time
// when OPENAI_API_KEY isn't set.
let client: OpenAI | undefined

export const getOpenAIClient = () => {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return client
}
