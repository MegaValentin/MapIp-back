import {z} from "zod"

export const registerSchema = z.object({
    username: z.string({
        required_error: "Username is required"
    }),
    legajo: z.number({
        required_error: "Legajo is required"
    }).min(4, {
        message: "The legajo number must have 4 digits"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(4,{
        message: "The password must be at least 4 characters long."
    })
})

export const loginSchema = z.object({
    legajo: z.number({
      required_error: 'Legajo is required',
    })
      .int()
      .gte(1000, { message: "El legajo debe tener 4 dígitos" })
      .lte(9999, { message: "El legajo debe tener 4 dígitos" }),
    password: z.string({
      required_error: 'Password is required',
    }).min(4, {         
      message: "La contraseña debe ser por lo menos de 4 caracteres",
    }),
  });