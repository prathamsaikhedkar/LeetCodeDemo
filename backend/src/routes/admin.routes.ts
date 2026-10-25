import { Router } from "express"
import { createProblem } from "../controllers/admin.controllers.js"

const router = Router()

router.route('/problems')
.post(createProblem)

export default router
    