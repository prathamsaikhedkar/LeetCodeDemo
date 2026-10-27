import config from "./utils/config.js"
import express from "express"
import type { Request, Response, NextFunction } from "express"
import cors from "cors"
import { rateLimit } from "express-rate-limit"
import { logger, fileLogger } from "./utils/logging/pino.js"
import morgan from "morgan"
import { ApiError, ApiResponse } from "./utils/api_formats.js"
import userRoutes from "./routes/user.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import adminRoutes from './routes/admin.routes.js'
import submissionRoutes from './routes/submission.routes.js'
import { errorMiddleware } from "./utils/error_handling/error_middleware.js"

const app = express()

app.use(express.json())

app.use(cors({
    origin: [config.CORS_ORIGIN as string, "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false,
})

app.use(limiter)


app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use("/users", userRoutes)
app.use("/problems", problemRoutes)
app.use('/admin', adminRoutes)
app.use("/submissions", submissionRoutes)

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, "Server is healthy"))
})

app.use(async(req: Request, res: Response) => {
  res.status(404).json(new ApiError(404, "invalid endpoint"))
})

app.use(errorMiddleware)

export default app

