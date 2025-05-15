import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        
    },
    legajo:{
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    authorized: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("User", userSchema)

