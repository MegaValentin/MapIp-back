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
        
    },
    estado: {
        type: String,
        enum: ['libre', 'ocupada', 'conflicto'],
        default: 'libre'
    },
    hostname: { 
        type: String,
        unique: true,
        sparse: true },
    mac: {
        type: String,
        unique: true,
        sparse: true // 👈 Importante si algunas IPs no tienen MAC
      },
    area: String,
    observaciones: String,
    detectada: {
        type: Boolean,
        default: false
    },
    ultimaDeteccion: Date,
    equipo: {
        type:String,
        enum: ["computadora","router", "impresora", "servidor"],
        default: null
    } 

    
}, {timestamps: true})

export default mongoose.model('Ip', ipSchema)