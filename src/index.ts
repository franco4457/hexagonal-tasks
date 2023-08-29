import app from '@/infraestructure/express/app'

const PORT = process.env.PORT ?? 3000
const HOST = process.env.EXPRESS_HOST ?? `http://localhost:${PORT}`

app.listen(PORT, () => {
  console.log('--------------------')
  console.log(`[EXPRESS] Server listen on ${HOST}`)
  console.log('--------------------')
})
