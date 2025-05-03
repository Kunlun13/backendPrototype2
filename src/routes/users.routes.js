import { Router } from "express";
import { addNewPersonalGroup, addNewTask, enlistGroup, enlistTask, removeGroup, removeTask, signin, signup, updateTask } from "../controllers/users.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const userRouter = Router()

userRouter.route("/signup").post(signup)
userRouter.route("/signin").post(signin)

userRouter.route("/newPersonalGroup").post(verifyJWT, addNewPersonalGroup)
userRouter.route("/removeGroup").post(verifyJWT, removeGroup)

userRouter.route("/addNewTask").post(verifyJWT, addNewTask)
userRouter.route("/updateTask").post(verifyJWT, updateTask)
userRouter.route("/enlistTask").post(verifyJWT, enlistTask)
userRouter.route("/enlistGroup").post(verifyJWT, enlistGroup)
userRouter.route("/removeTask").post(verifyJWT, removeTask)

export default userRouter