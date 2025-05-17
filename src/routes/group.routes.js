import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addNewGroup, checkPermission, enlistGroup, removeTask } from "../controllers/groups.controllers.js";

const groupRouter = Router()

groupRouter.route("/addNewGroup").post(verifyJWT, addNewGroup)
groupRouter.route("/enlistGroup").post(verifyJWT, enlistGroup)
groupRouter.route("/removeTask").post(verifyJWT, removeTask)
groupRouter.route("/permission").post(verifyJWT, checkPermission)

export {groupRouter}