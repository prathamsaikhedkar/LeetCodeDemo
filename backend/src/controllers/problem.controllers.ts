import { Problems } from "../db/schema.js"
import connect_db from "../connect_db.js"
import { eq } from "drizzle-orm"
import { ApiResponse, ApiError } from "../utils/api_formats.js"
import type { Request, Response } from "express"

const db = connect_db()

if (!db) {
  throw new Error("Database connection failed")
}

export const getAllProblems = async (req: Request, res: Response) => {
  const problems = await db.select().from(Problems)

  if (problems.length === 0) {
    throw new ApiError(404, "No problems found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Problems fetched successfully", problems))
}

export const getProblemById = async (req: Request, res: Response) => {
  const { id } = req.params

  const problem = await db
    .select()
    .from(Problems)
    .where(eq(Problems.id, parseInt(id as string)))

  if (problem.length === 0) {
    throw new ApiError(404, "Problem not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Problem fetched successfully", problem))
}
