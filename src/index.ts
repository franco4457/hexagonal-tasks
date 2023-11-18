import app from '@/infraestructure/express/app'
import { PORT, HOST } from '@/config'

app.start(PORT, HOST)
