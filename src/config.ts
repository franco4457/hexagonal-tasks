import { config } from 'dotenv'
config()

export const {
  NODE_ENV,
  PORT = 3000,
  HOST = `http://localhost:${PORT}`,
  DIALECT = 'memory',
  DB_URL = ''
} = process.env

export const JWT_SECRET = NODE_ENV === 'test' ? 'test' : (process.env.JWT_SECRET as string)
