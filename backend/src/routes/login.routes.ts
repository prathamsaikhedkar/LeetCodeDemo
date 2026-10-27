import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import type{Request, Response} from "express"
import { Users, Accounts } from "../db/schema.js"
import connect_db from "../connect_db.js"
import { eq } from "drizzle-orm"
import { ApiResponse, ApiError } from "../utils/api_formats.js"

const db = connect_db()

if (!db) {
  throw new Error("Database connection failed")
}

export const login = async (req: Request, res: Response) => {
  

}