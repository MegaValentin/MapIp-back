    import express from 'express'
    import cors from 'cors'
    import dotenv from "dotenv";
    import cookieParser from 'cookie-parser';
    import morgan from 'morgan';

    import ipsRouter from './routes/ip.routes.js'
    import officeRouter from './routes/office.routes.js'
    import routerRouter from './routes/router.routes.js'
    import userRouter from './routes/user.routes.js'


    dotenv.config()

    const app = express()

    const corsOptions = {
        origin: 'http://localhost:5173', // URL de tu frontend
        credentials: true, // para aceptar cookies y credenciales
    }

    app.use(cors(corsOptions))
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(cookieParser())

    app.use('/api/auth', userRouter)
    app.use('/api', ipsRouter)
    app.use('/api', officeRouter)
    app.use('/api', routerRouter)


    export default app