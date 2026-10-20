import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"

const connect_db = () => {
  try {
    const db = drizzle(process.env.DATABASE_URL!)
    return db
  } catch (error) {
    console.log("Error connecting to database")
    return null
  }
}

export default connect_db
