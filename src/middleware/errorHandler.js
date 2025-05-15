import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Error de validación",
      errors: err.errors,
    });
  }

  res
    .status(500)
    .json({ message: err.message || "Error interno del servidor" });
};
