import type { Stream } from 'openai/streaming'
import type { ChatCompletionChunk } from 'openai/resources/chat/completions'

// Replacement for the `ai` package's OpenAIStream + StreamingTextResponse:
// streams the completion deltas as plain text (what the chat client reads)
// and invokes onCompletion with the full text once the stream ends.
export function streamChatCompletion(
  stream: Stream<ChatCompletionChunk>,
  onCompletion?: (completion: string) => Promise<void> | void
): Response {
  const encoder = new TextEncoder()
  let completion = ''

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            completion += text
            controller.enqueue(encoder.encode(text))
          }
        }
        if (onCompletion) await onCompletion(completion)
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
