import { Submissions } from "../db/schema.js"
import connect_db from "../connect_db.js"
import { eq } from "drizzle-orm"
import { ApiResponse, ApiError } from "../utils/api_formats.js"
import type { Request, Response } from "express"

export const createSubmission = async(req: Request, res: Response) => {
    const {problemId, userId, sourceCode} = req.body

    const db = connect_db()

    // submit code
    const status = 'accepted'
    
    const submission = await db.insert(Submissions).values({userId,problemId,code:sourceCode,status}).returning()
    if (submission.length == 0) {
        throw new ApiError(500,"could not create submission")
    }

    return res.status(201).json(new ApiResponse(201,"submission created successfully",submission))
}