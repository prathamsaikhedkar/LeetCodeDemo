import { Router } from "express"
import { createProblem } from "../controllers/admin.controllers.js"
import { getSubmissionById, getSubmissionsByUser } from "../controllers/submission.controllers.js"

const router = Router()

router.route('/:id')
.get(getSubmissionById)

router.route('/:userId')
.get(getSubmissionsByUser)

export default router
    