import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { ApiError } from "./utils/api_formats.js"

// Singleton: created once on first import, reused everywhere
let db: ReturnType<typeof drizzle> | null = null

const connect_db = () => {
  if (db) return db

  try {
    db = drizzle(process.env.DATABASE_URL!)
    return db
  } catch (error) {
    console.log("Error connecting to database")
    
    throw new ApiError(500, "could not connect to database")
  }
}

export default connect_db
