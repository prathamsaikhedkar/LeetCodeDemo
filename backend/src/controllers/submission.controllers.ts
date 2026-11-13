import { Submissions } from "../db/schema.js"
import connect_db from "../connect_db.js"
import { eq } from "drizzle-orm"
import { ApiResponse, ApiError } from "../utils/api_formats.js"
import type { Request, Response } from "express"
import { z } from "zod"
import { submitCodeExecution, getExecutionResult, executionResponseSchema, executionRequestSchema } from "./execution.controllers.js"

const db = connect_db()

if (!db) {
  throw new Error("Database connection failed")
}

type SubmissionBody = {
  problemId: number
  userId: number
  sourceCode: string
  languageId: number
}

export const createSubmission = async (req: Request, res: Response) => {
  const { problemId, userId, sourceCode, languageId }: SubmissionBody = req.body

  if (!problemId || !userId || !sourceCode || !languageId) {
    throw new ApiError(400, "problemId, userId, sourceCode, and languageId are required")
  }
  const {token} : z.infer<typeof executionRequestSchema> = await submitCodeExecution(sourceCode, languageId)

  const response : z.infer<typeof executionResponseSchema> = await getExecutionResult(token, ["stdout", "time", "memory", "stderr", "compile_output", "message", "status"])

  if (!response || !response.status) {
    throw new ApiError(500, "Invalid response from execution service")
  }
  
  const submission = await db
    .insert(Submissions)
    .values({
      userId: Number(userId),
      problemId: Number(problemId),
      code: sourceCode,
      status: response.status.description,
      stdout: response.stdout ?? "",
      timeTaken: response.time ?? 0,
      memoryUsed: response.memory ?? 0,
      stderr: response.stderr ?? "",
    })
    .returning()
  if (submission.length == 0) {
    throw new ApiError(500, "could not create submission")
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "submission created successfully", submission))
}

export const getSubmissionById = async (req: Request, res: Response) => {
  const { id } = req.params

  const submission = await db
    .select()
    .from(Submissions)
    .where(eq(Submissions.id, Number(id)))

  if (!submission || submission.length === 0) {
    throw new ApiError(404, "submission not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "submission fetched successfully", submission))
}

export const getSubmissionsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  if (!Number(userId)) {
    throw new ApiError(400, "invalid userId")
  }

  const submissions = await db
    .select()
    .from(Submissions)
    .where(eq(Submissions.userId, Number(userId)))

  if (!submissions || submissions.length === 0) {
    throw new ApiError(404, "submissions not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "submissions fetched successfully", submissions))
}
