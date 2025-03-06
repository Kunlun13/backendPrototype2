import { Router } from "express";
import { signin, signup } from "../controllers/users.controllers.js";

const userRouter = Router()

userRouter.route("/signup").post(signup)
userRouter.route("/signin").post(signin)

export default userRouter