import * as authService from "../services/auth.services.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "../schemas/auth.schema.js";

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.registerUser(validatedData);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { user, token } = await authService.loginUser(
      validatedData.legajo,
      validatedData.password
    );

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const authorizeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await authService.authorizeUser(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await authService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    const { id } = req.user;

    await authService.changePassword(
      id,
      validatedData.currentPassword,
      validatedData.newPassword
    );
    res.json({ message: "Contraseña actualizada con exito" });
  } catch (error) {
    next(error);
  }
};
