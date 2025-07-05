import { Router } from "express";
import { addNewPersonalGroup, addNewTask, changePassword, editGroup, enlistGroup, enlistTask, logout, profile, removeGroup, removeTask, signin, signup, updateTask } from "../controllers/users.controllers.js";
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
userRouter.route("/editGroup").put(verifyJWT, editGroup)
userRouter.route("/profile").post(verifyJWT, profile)
userRouter.route("/changePassword").put(verifyJWT, changePassword)
userRouter.route("/logout").get(verifyJWT, logout)

export default userRouter