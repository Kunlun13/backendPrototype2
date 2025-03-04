import app from "./App.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"


dotenv.config({path: "src/.env"})

const port = process.env.PORT || 3000



connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
})
.catch((err) => {
    console.log("Something went wrong!!!")
})