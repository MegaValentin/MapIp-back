import mongoose from "mongoose";

export function validateMongoId(req, res, next) {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido de MongoDB" });
    }
  
    next();
  }