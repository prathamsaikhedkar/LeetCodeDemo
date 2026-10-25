import { Users } from "../db/schema.js"
import connect_db from "../connect_db.js"
import { eq } from "drizzle-orm"
import { ApiResponse, ApiError } from "../utils/api_formats.js"
import type { Request, Response } from "express"

const db = connect_db()

if (!db) {
  throw new Error("Database connection failed")
}

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await db.select().from(Users)

  if (users.length === 0) {
    throw new ApiError(404, "No users found")
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users))
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.id, parseInt(id as string)))

  if (user.length === 0) {
    throw new ApiError(404, "User not found")
  }

  res.status(200).json(new ApiResponse(200, "User fetched successfully", user))
}

export const createUser = async (req: Request, res: Response) => {
  console.log(req.params);
  console.log(req.body);
  const { username, age } = req.body

  const newUser = await db.insert(Users).values({ username, age }).returning()

  if (!newUser) {
    throw new ApiError(500, "Failed to create user")
  }

  res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", newUser))
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { username, age } = req.body

  const updatedUser = await db
    .update(Users)
    .set({ username, age })
    .where(eq(Users.id, parseInt(id as string)))

  if (!updatedUser) {
    throw new ApiError(500, "Failed to update user")
  }
  res
    .status(200)
    .json(new ApiResponse(200, "User updated successfully", updatedUser))
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const deletedUser = await db.delete(Users).where(eq(Users.id, parseInt(id as string)))

  if (!deletedUser) {
    throw new ApiError(500, "Failed to delete user")
  }

  res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully", deletedUser))
}
