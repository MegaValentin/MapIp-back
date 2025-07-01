import { Router } from "express"

import { getOffices,
getOffice,
deleteOffice,
updatedOffice,
addOffice,
addAllOffice,
getPaginatedOffices} from "../controller/office.controller.js"
import { authRequired } from "../middleware/validator.token.js"
import { verifyRole } from "../middleware/validator.role.js"
import multer from 'multer'

const upload = multer({dest: "uploads"})

const router = Router()

router.get('/offices', authRequired, getOffices)

router.get('/office/:id', authRequired, getOffice)

router.get("/offices/paginated", getPaginatedOffices)

router.put('/office/:id', authRequired, updatedOffice)

router.delete('/office/:id', authRequired, verifyRole(['admin', 'user']), deleteOffice)

router.post('/addoffice', authRequired,  addOffice)

router.post('/addfile', upload.single('file'), authRequired, addAllOffice)


export default router