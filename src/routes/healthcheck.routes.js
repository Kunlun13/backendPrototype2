import { Router } from "express"
import healthcheck from "../controllers/healthcheck.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"


const healthcheckRouter = Router()

healthcheckRouter.route("/").get(healthcheck)
healthcheckRouter.route("/secure").post(verifyJWT, healthcheck)

export default healthcheckRouter