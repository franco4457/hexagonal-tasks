import app from '@/infraestructure/express/app'

const PORT = process.env.PORT ?? 3000
const HOST = process.env.HOST ?? `http://localhost:${PORT}`

app.start(PORT, HOST)
