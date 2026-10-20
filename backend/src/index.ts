import connect_db from "./connect_db.js"
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { eq } from "drizzle-orm"
import { Users } from "./db/schema.js"
import { ApiResponse, ApiError } from "./utils/api_formats.js"
import express from "express"
import type { Request, Response, NextFunction } from "express"
import cors from "cors"
import {rateLimit} from "express-rate-limit"
import pino from "pino"
import morgan from "morgan"

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

// configure morgan
morgan(':method :url :status :res[content-length] - :response-time ms')

async function main() {
  const db = connect_db()

  if (db === null) {
    console.error("Failed to connect to the database.")
    process.exit(1)
  }

  const user: typeof Users.$inferInsert = {
    username: "John",
    age: 30
  }

  await db.insert(Users).values(user)
  console.log("New user created!")

  const users = await db.select().from(Users)
  console.log("Getting all users from the database: ", users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(Users)
    .set({
      age: 31,
    })
    .where(eq(Users.username, user.username))
  console.log("User info updated!")

  await db.delete(Users).where(eq(Users.username, user.username))
  console.log("User deleted!")
}

main()

app.get("/health", (req, res) => {
  res.status(200).send("OK")
})

app.use((err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  const status = (err instanceof ApiError) ? err.status : 500
  res.status(status).json(new ApiError(status, err.message))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
