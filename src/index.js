import app from "./app.js";
import connctDB from "./db.js";
import dotenv from "dotenv"

dotenv.config()
const port = process.env.PORT || 3535

connctDB()

app.listen(port, () => {
    console.log(`servidor en el puerto ${port}`)
})