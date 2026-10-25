import "dotenv/config"
import express from "express"
import type { Request, Response, NextFunction } from "express"
import cors from "cors"
import { rateLimit } from "express-rate-limit"
import pino from "pino"
import morgan from "morgan"
import { ApiError } from "./utils/api_formats.js"
import userRoutes from "./routes/user.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import adminRoutes from './routes/admin.routes.js'

const app = express()

app.use(express.json())

app.use(cors({
    origin: [process.env.CORS_ORIGIN as string, "http://localhost:5173"],
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

// configure pino
const logger = pino()
logger.info("Application started")

const fileLogger = pino(pino.destination({dest: './logs/app.log', sync: false}))
fileLogger.info("Application started and logging to file")

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use("/users", userRoutes)
app.use("/problems", problemRoutes)
app.use('/admin', adminRoutes)

app.get("/health", (req, res) => {
  res.status(200).send("OK")
})

app.use((err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  const status = (err instanceof ApiError) ? err.status : 500
  fileLogger.error(err.message)
  return res.status(status).json(new ApiError(status, err.message))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
