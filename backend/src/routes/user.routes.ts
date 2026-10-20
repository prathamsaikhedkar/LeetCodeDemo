import { Router } from "express"
import { Users } from "../db/schema.js"
import connect_db from "../connect_db.js"
import { ApiResponse, ApiError } from "../utils/api_formats.js"
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controllers.js"

const router = Router()
const db = connect_db()

if (!db) {
  throw new Error("Database connection failed")
}

router.route("/users")
  .get(getAllUsers)
  .post(createUser)

router.route("/users/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser)