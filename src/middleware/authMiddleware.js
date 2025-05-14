import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const isAuthenticated  = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Token no proporcionado");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("Usuario no válido");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "No autorizado", error: err.message });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Solo administradores." });
  }
  next();
};
