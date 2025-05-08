import { body, param, validationResult } from "express-validator"

export const validateUpdateRouter = [
    param("id")
        .isMongoId()
        .withMessage("El ID enviado no es un ObjectId valid"),

    body("observaciones")
        .optional()
        .isBoolean()
        .withMessage("El campo observaciones debe ser un texto"),
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                error: errors.array().map((err) => ({
                    campo: err.param,
                    mensaje: err.msg
                })),
            })
        }
        next
    }
]