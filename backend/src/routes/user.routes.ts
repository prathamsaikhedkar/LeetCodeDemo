import { Router } from "express"
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controllers.js"

const router = Router()

router.route("/")
  .get(getAllUsers)
  .post(createUser)

router.route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser)

export default router

