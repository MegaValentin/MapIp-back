import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/users.model.js";

export const registerUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const loginUser = async (legajo, password) => {

  const user = await User.findOne({ legajo });
  if (!user) throw new Error("Usuario no encontrado");

  const match = await user.comparePassword(password);
  if (!match) throw new Error("Contraseña incorrecta");

  if (!user.authorized) throw new Error("Usuario no autorizado. Esperando aprobación del administrador.");

  const payload = { id: user._id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  user.password = undefined;
  return { user, token };
};

export const getAllUsers = () => User.find()

export const authorizeUser  = async (id) => {
    const user = await User.findById(id)
    if(!user) throw new Error("Usuario no encontrado")

    user.authorized = true
    return await user.save()
}

export const deleteUser = async (id) => {
    const result = await User.findByIdAndDelete(id)
    if(!result) throw new Error("Usuario no encontrado")
    return { message: "Usuario eliminado correctamente"}
}

export const changePassword = async (id, currentPassword, newPassword) => {
    const user = await User.findById(id)
    if(!user) throw new Error("Usuario no encontrado")

    const match = await user.comparePassword(currentPassword);
    if (!match) throw new Error("Contraseña actual incorrecta");
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
}