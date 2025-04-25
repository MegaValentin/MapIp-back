import express from 'express'

import ipsRouter from './routes/ip.routes.js'

const app = express()
app.use(express.json())
app.use('/api', ipsRouter)
export default app