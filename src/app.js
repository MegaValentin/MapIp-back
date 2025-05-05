import express from 'express'

import ipsRouter from './routes/ip.routes.js'
import officeRouter from './routes/office.routes.js'
import routerRouter from './routes/router.routes.js'

const app = express()
app.use(express.json())

app.use('/api', ipsRouter)
app.use('/api', officeRouter)
app.use('/api', routerRouter)

export default app