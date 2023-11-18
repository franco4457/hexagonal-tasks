import { config } from 'dotenv'
config()

export const {
  PORT = 3000,
  HOST = `http://localhost:${PORT}`,
  DIALECT = 'memory',
  DB_URL = ''
} = process.env
