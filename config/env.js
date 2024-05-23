import dotenv from 'dotenv'
dotenv.config()

const DEFAULT_PORT = 3000
const DEFAULT_UPLOAD_DIR = '/tmp'
const DEFAULT_LOG_LEVEL = 'warn'

export default {
  // Define the port number
  port: process.env.PORT || DEFAULT_PORT,
  uploadDir: process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR,
  logLevel: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL
}
