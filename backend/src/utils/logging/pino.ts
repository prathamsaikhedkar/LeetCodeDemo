import pino from 'pino'

export const logger = pino()
logger.info("Application started")

export const fileLogger = pino(pino.destination({dest: './logs/app.log', sync: false}))
fileLogger.info("Application started and logging to file")