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

export const getSubmissionById = async(req: Request, res: Response) => {
    const db = connect_db()
    const {id} = req.params

    const submission = db.select().from(Submissions).where(eq(Submissions.id,Number(id)))

    if (!submission) {
        throw new ApiError(404,"submission not found")
    }

    return res.status(200).json(new ApiResponse(200,"submission fetched successfully",submission))
}

export const getSubmissionsByUser = async(req: Request, res: Response) => {
    const db = connect_db()
    const {userId} = req.params

    if (!Number(userId)) {
        throw new ApiError(400,"invalid userId")
    }

    const submissions = db.select().from(Submissions).where(eq(Submissions.userId,Number(userId)))

    if (!submissions) {
        throw new ApiError(404,"submissions not found")
    }

    return res.status(200).json(new ApiResponse(200,"submissions fetched successfully",submissions))
}