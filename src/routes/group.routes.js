import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addNewGroup, addNewTask, checkOwner, checkPermission, enlistGroup, enlistTask, joinGroup, removeGroup, removeMember, removeTask, updateMemberPermission, updateTask, viewMembers } from "../controllers/groups.controllers.js";

const groupRouter = Router()

groupRouter.route("/addNewGroup").post(verifyJWT, addNewGroup)
groupRouter.route("/enlistGroup").post(verifyJWT, enlistGroup)
groupRouter.route("/removeTask").post(verifyJWT, removeTask)
groupRouter.route("/permission").post(verifyJWT, checkPermission)
groupRouter.route("/addTask").post(verifyJWT, addNewTask)
groupRouter.route("/enlistTask").post(verifyJWT, enlistTask)
groupRouter.route("/joinGroup").post(verifyJWT, joinGroup)
groupRouter.route("/viewMember").post(verifyJWT, viewMembers)
groupRouter.route("/updateMember").post(verifyJWT, updateMemberPermission)
groupRouter.route("/removeMember").post(verifyJWT, removeMember)
groupRouter.route("/removeGroup").post(verifyJWT, removeGroup)
groupRouter.route("/updateTask").post(verifyJWT, updateTask)
groupRouter.route("/amIOwner").post(verifyJWT, checkOwner)

export {groupRouter}