import { Problems, Users, Examples } from "../db/schema.js"
import connect_db from "../connect_db.js"
import { eq } from "drizzle-orm"
import { ApiResponse, ApiError } from "../utils/api_formats.js"
import type { Request, Response } from "express"

const db = connect_db()

if (!db) {
  throw new Error("Database connection failed")
}

export const createProblem = async(req: Request, res: Response) => {
    const {title, description, testCases, difficulty, solution, problemExamples} = req.body

    const examplesToInsert = Array.from(problemExamples || testCases)
    console.log(examplesToInsert);    

    const problem = await db.insert(Problems).values({title, description,difficulty}).returning()
    if (problem.length === 0 || !problem[0]) {
        throw new ApiError(500, "failed to create problem")
    }
    const examples = await db.insert(Examples).values(examplesToInsert.map((example: any) => ({
        problemId: Number(problem[0]?.id),
        input: example.input as string,
        output: example.output as string
    }))).returning()


    return res.status(201).json(new ApiResponse(201, "problem created successfully",{problem,examples}))
}

