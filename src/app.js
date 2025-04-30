import express from 'express'

import ipsRouter from './routes/ip.routes.js'
import officeRouter from './routes/office.routes.js'

const app = express()
app.use(express.json())

app.use('/api', ipsRouter)
app.use('/api', officeRouter)

export default app