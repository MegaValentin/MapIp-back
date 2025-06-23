import { body, param, validationResult } from "express-validator";

export const validateUpdate = [
  param("id").isMongoId().withMessage("El ID enviado no es un ObjectId válido"),

  body("estado")
    .optional()
    .isIn(["libre", "ocupada", "conflicto"])
    .withMessage("Estado debe ser 'libre', 'ocupada', 'conflicto'"),

  body("hostname")
    .optional()
    .isString()
    .withMessage("El hostname debe ser un texto"),

  body("mac")
    .optional()
    .trim()
    .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
    .withMessage("La dirección MAC debe tener el formato XX:XX:XX:XX:XX:XX"),
  body("area")
    .optional()
    .isString()
    .withMessage("El campo área debe ser un texto"),
  body("asignadaA")
    .optional()
    .isString()
    .withMessage("El campo asignadaA debe ser un texto"),

  body("observaciones")
    .optional()
    .isString()
    .withMessage("El campo observaciones debe ser un texto"),

  body("detectada")
    .optional()
    .isBoolean()
    .withMessage("Detectada debe ser true o false"),

  body("ultimaDeteccion")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Ultima detección debe ser una fecha válida"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array().map((err) => ({
          campo: err.param,
          mensaje: err.msg,
        })),
      });
    }
    next();
  },
];
