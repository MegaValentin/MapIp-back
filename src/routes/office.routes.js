import { Router } from "express"

import { getOffices,
getOffice } from "../controller/office.controller"

const router = Router()

router.get('/offices', getOffices)

router.get('/office/:id', getOffice)

router.put('/office/:id')

router.delete('/office/:id')

router.post('/addoffice')

router.post('/addalloffices')


export default router