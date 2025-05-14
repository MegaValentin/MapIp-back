import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    legajo: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        min: 1
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    authorized: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.password
    return obj
}
export default mongoose.model('User', userSchema)