import type{ Request, Response } from "express"
import { ApiResponse, ApiError } from "../utils/api_formats.js"
import CODEBOX_URL from "../utils/config.js"
import { z } from "zod"

export const executionResponseSchema = z.object({
  stdout: z.string().nullable().optional(),
  time: z.number().nullable().optional(),
  memory: z.number().nullable().optional(),
  stderr: z.string().nullable().optional(),
  token: z.string().nullable().optional(),
  compile_output: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  status: z
    .object({
      id: z.number(),
      description: z.string()
    })
    .nullable()
    .optional()
})

export const executionRequestSchema = z.object({
  source_code: z.string(),
  language_id: z.number(),
  token: z.string(),
})

export type ExecutionRequest = z.infer<typeof executionRequestSchema>
export type ExecutionRequestResponse = z.infer<typeof executionResponseSchema>

export const submitCodeExecution = async (code: string, languageId: number) => {
    if (!code || !languageId) {
        throw new ApiError(400, "Code and language are required")
    }

    const body = {
        source_code: code,
        language_id: languageId
    }

    const response = await fetch(`${CODEBOX_URL}/submissions/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) {
        throw new ApiError(response.status, "Failed to execute code")
    }

    const result = executionRequestSchema.safeParse(await response.json())
    if (!result.success) {
        throw new ApiError(500, "Invalid response format from execution service")
    }

    return result.data
}

export const getExecutionResult = async (submissionId: string, fields: string[]) : Promise<ExecutionRequestResponse> => {
    let url = `${CODEBOX_URL}/submissions/${submissionId}`
    if (fields && fields.length > 0) {
        const params =  fields.join(",")
        url += `?fields=${params}`
    }

    const response = await fetch(url, 
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
)

    if (!response.ok) {
        throw new ApiError(response.status, "Failed to get execution result")
    }

    const result = executionResponseSchema.safeParse(await response.json())
    if (!result.success) {
        throw new ApiError(500, "Invalid response format from execution service")
    }
    return result.data
}