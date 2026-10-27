import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../api_formats.js"
import { fileLogger } from "../logging/pino.js"

export const errorMiddleware = async(err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  const status = (err instanceof ApiError) ? err.status : 500
  fileLogger.error(err.message)
  return res.status(status).json(new ApiError(status, err.message))
}