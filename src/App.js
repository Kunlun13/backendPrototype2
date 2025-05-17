import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/users.routes.js"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/error.middlewares.js"
import { groupRouter } from "./routes/group.routes.js"


dotenv.config({path: "./.env"})
const app = express()
console.log(process.env.CORS_ORIGIN)
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)

// app.options('*', cors())

// safety middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
// app.use(errorHandler)

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/groups", groupRouter)

export default app