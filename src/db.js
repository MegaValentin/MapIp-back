import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const urlDB = process.env.MONGODB_URL

const connctDB = async () => {
    try {
        await mongoose.connect(urlDB)
        console.log("db connected")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connctDB