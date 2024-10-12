import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

interface QNAProps {
  fileId: string
}

const QNA = ({ fileId }: QNAProps) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1)
  const [questionType, setQuestionType] = useState<string>('Subjective')
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(
    null
  )

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(10, Number(event.target.value)))
    setNumberOfQuestions(value)
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionType(event.target.value)
  }

  const { mutate: generateQuestions } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/generateqna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          numQuestions: numberOfQuestions,
          questionType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')

      let done = false
      let result = ''

      while (!done) {
        const { done: streamDone, value } = await reader?.read() || {}

        if (streamDone) {
          done = true
          break
        }

        const textChunk = decoder.decode(value, { stream: true })
        result += textChunk
      }

      return result
    },
    onSuccess: (data) => {
      setGeneratedResponse(data)
    },
    onError: (error) => {
      console.error('Error generating questions:', error)
    },
  })

  const handleSubmit = () => {
    generateQuestions()
  }

  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-md max-w-xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Q&A Generation Tool
      </h2>

      <div className="mb-6">
        <label
          htmlFor="numberOfQuestions"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Questions (1-10):
        </label>
        <input
          type="number"
          id="numberOfQuestions"
          value={numberOfQuestions}
          onChange={handleNumberChange}
          min={1}
          max={10}
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 p-2"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="questionType"
          className="block text-sm font-medium text-gray-700"
        >
          Select Question Type:
        </label>
        <select
          id="questionType"
          value={questionType}
          onChange={handleTypeChange}
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 p-2"
        >
          <option value="Subjective">Subjective</option>
          <option value="MCQ">MCQ</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3 rounded-md font-semibold text-lg hover:shadow-lg transition duration-300 transform hover:scale-105"
      >
        Generate Questions!
      </button>

      {generatedResponse && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Generated Q&A:
          </h3>
          <div className="whitespace-pre-wrap text-gray-700 space-y-6">
            {generatedResponse.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line.startsWith('### Question:') ? (
                  <div className="bg-blue-50 p-4 rounded-md mb-2">
                    <h4 className="text-lg font-bold text-blue-800">
                      {line.replace('### Question:', '').trim()}
                    </h4>
                  </div>
                ) : line.startsWith('### Answer:') ? (
                  <div className="bg-green-50 p-4 rounded-md mb-2">
                    <h4 className="text-lg font-bold text-green-800">Answer:</h4>
                    <p className="text-gray-700">
                      {line.replace('### Answer:', '').trim()}
                    </p>
                  </div>
                ) : line ? (
                  <p className="mb-1 text-gray-600">{line}</p>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QNA
