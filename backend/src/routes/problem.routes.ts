import { Router } from "express"
import { Problems } from "../db/schema.js"
import connect_db from "../connect_db.js"
import { ApiResponse, ApiError } from "../utils/api_formats.js"
import { getAllProblems, getProblemById } from "../controllers/problem.controllers.js"


const router = Router()
const db = await connect_db()

router.route("/problems")
.get(getAllProblems)

router.route("/problems/:id")
.get(getProblemById)