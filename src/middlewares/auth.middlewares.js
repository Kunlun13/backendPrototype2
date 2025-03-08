import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken

    if(!accessToken)
    return res.status(500).send("Access not found")
    // return next(Error)

    try {
        const decodedJSON = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedJSON?._id).select("-password -refreshToken")
    
        if(!user)
        return res.status(500).send("User not found")
    
        req.user = user
        next()
    } catch (error) {
        return res.status(500).send("Miscllenious Error")
    }
})