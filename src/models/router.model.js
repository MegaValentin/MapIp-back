import mongoose from "mongoose";

const routerSchema = new mongoose.Schema({
    nombre: String,
    wan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ip',
        required: true,
        unique: true
    },
    puertaEnlace: {
        type:String,
        required: true
    },
    observaciones: String,
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area'
    }
}, {timestamps: true})

export default mongoose.model('Router', routerSchema)