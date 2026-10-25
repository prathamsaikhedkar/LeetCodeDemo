import { Router } from "express"
import { getAllProblems, getProblemById } from "../controllers/problem.controllers.js"

const router = Router()

router.route("/")
.get(getAllProblems)

router.route("/:id")
.get(getProblemById)

export default router
    