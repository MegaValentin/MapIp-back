import mongoose from "mongoose";

export const validateMongoId = (req, res, next)  => {
    const { id } = req.params

    if(!mongoose.Type.ObjectId.isValid(id)){
        return res.status(400).json({ message: "ID invalido"})
    }

    next()
}