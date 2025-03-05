import { Router } from "express";
import { signup } from "../controllers/users.controllers.js";

const userRouter = Router()

userRouter.route("/signup").post(signup)

export default userRouter