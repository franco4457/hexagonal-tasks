import app from '@/infraestructure/express/app'
import { PORT, HOST } from '@/config'

;(await app).start(PORT, HOST)
