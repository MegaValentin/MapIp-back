import mongoose from "mongoose";
const { Schema } = mongoose;

const routerSchema = new mongoose.Schema({
    nombre: String,
    wanId: {
        type: Schema.Types.ObjectId,
        ref: 'Ip'
    },
    wan: {
        type: String,
        required: true,
        trim: true
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