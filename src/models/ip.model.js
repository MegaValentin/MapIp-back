import mongoose from "mongoose";

const ipSchema = new mongoose.Schema({
    direccion : {
        type: String,
        required: true,
        unique: true
    },
    marcaraSubRed: String,
    puertaEnlace: {
        type:String,
        required: true
    },
    estado: {
        type: String,
        enum: ['libre', 'ocupada', 'conflicto'],
        default: 'libre'
    },
    hostname: String,
    mac: String,
    area: String,
    obsevaciones: String,
    detectada: {
        type: Boolean,
        default: false
    },
    ultimaDeteccion: Date,
    
}, {timestamps: true})

export default mongoose.model('Ip', ipSchema)