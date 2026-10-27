import "dotenv/config"

const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173"
const CODEBOX_URL = process.env.CODEBOX_URL || "http://localhost:3001"

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables")
}

export default {PORT, DATABASE_URL, CORS_ORIGIN, CODEBOX_URL}

