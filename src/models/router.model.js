import mongoose from "mongoose";

const routerSchema = new mongoose.Schema({
    nombre: String,
    wan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ip',
        required: true,
        unique: true
    },
    lan: {
        type:String,
        
    },
    userAdmin: String,
    passAdmin: String,
    observaciones: String,
    ssid: String,
    passSsid: String,
    area: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

export default mongoose.model('RouterModel', routerSchema)