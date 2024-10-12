import {z} from "zod"

export const SendMessageValidator = z.object({
    fileId: z.string(),
    message: z.string()
})


export const QNAgeneratorValidator = z.object({
    fileId: z.string(),
    numQuestions: z.number(),
    questionType: z.string(),
})