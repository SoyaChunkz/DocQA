import { Document } from '@langchain/core/documents'
// Import the implementation directly: pdf-parse's index.js runs a debug
// harness when bundled (module.parent is undefined under webpack).
import pdf from 'pdf-parse/lib/pdf-parse.js'

// Minimal replacement for langchain's PDFLoader: one Document per page,
// with the same metadata fields the upload pipeline stores in Pinecone.
export async function loadPdfPages(blob: Blob): Promise<Document[]> {
  const buffer = Buffer.from(await blob.arrayBuffer())
  const pages: string[] = []

  const result = await pdf(buffer, {
    pagerender: async (pageData: any) => {
      const textContent = await pageData.getTextContent()
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      pages.push(text)
      return text
    },
  })

  return pages.map(
    (pageContent, i) =>
      new Document({
        pageContent,
        metadata: {
          pdf: {
            version: result.version,
            info: result.info,
            totalPages: result.numpages,
          },
          loc: { pageNumber: i + 1 },
        },
      })
  )
}
