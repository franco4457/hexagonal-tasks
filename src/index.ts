import app from '@/infraestructure/express/app'
import { PORT, HOST } from '@/config'

app
  .then((api) => {
    api.start(PORT, HOST)
  })
  .catch((err) => {
    console.error(err)
  })
