import e from 'express'

export const healthRouter = e.Router()

healthRouter.get('', (_req, res) => {
  res.json({ message: 'OK' })
})
healthRouter.post('', (_req, res) => {
  res.json({ message: 'OK' })
})
healthRouter.put('', (_req, res) => {
  res.json({ message: 'OK' })
})
healthRouter.patch('', (_req, res) => {
  res.json({ message: 'OK' })
})
healthRouter.delete('', (_req, res) => {
  res.json({ message: 'OK' })
})
