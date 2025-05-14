import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import ipsRouter from './routes/ip.routes.js'
import officeRouter from './routes/office.routes.js'
import routerRouter from './routes/router.routes.js'
import authRoutes from './routes/users.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api', ipsRouter)
app.use('/api', officeRouter)
app.use('/api', routerRouter)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

export default app