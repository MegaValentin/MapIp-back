import express from 'express'
import cors from 'cors'
<<<<<<< HEAD
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
=======
import morgan from 'morgan'
import dotenv from 'dotenv'
>>>>>>> fdf48ac2287ca0339b374ea1d5739395de51a69f

import ipsRouter from './routes/ip.routes.js'
import officeRouter from './routes/office.routes.js'
import routerRouter from './routes/router.routes.js'
<<<<<<< HEAD
import userRouter from './routes/user.routes.js'

const app = express()
=======
import authRoutes from './routes/users.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.use(cors())
>>>>>>> fdf48ac2287ca0339b374ea1d5739395de51a69f
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', userRouter)
app.use('/api', ipsRouter)
app.use('/api', officeRouter)
app.use('/api', routerRouter)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

export default app