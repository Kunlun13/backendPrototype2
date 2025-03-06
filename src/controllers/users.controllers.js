import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateRefreshToken = async (userId)=> {
    
    try {
        const user = await User.findById(userId)
    
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validatBeforeSave: false})
        return refreshToken
    } catch (error) {
        return error
    }
}
const generateAccessToken = async (userId)=> {
    
    try {
        const user = await User.findById(userId)
    
        const accessToken = await user.generateAccessToken()
        user.accessToken = accessToken
        await user.save({validatBeforeSave: false})
        return accessToken
    } catch (error) {
        return error
    }
}

const signup = asyncHandler(async (req, res) => {
    const {name, username, password, email} = req.body
    
    if(!name || !username || !password)
    {
        throw new Error("name, username or password not Entered")
    }


    try {
        const user = await User.create({
                name,
                username,
                password,
                email : email?email:""
            })
            return res.status(200).send("New User Created Succewsfully!!!")

    } catch (error) {
        return res.status(400).send("something went wrong while creating new user ", error)
    }

})

const signin = asyncHandler(async (req, res) => {
    const {username, password} = req.body
    if(username=="" || password=="")
    return send.status(402).json({message: "Username or Password not Found"})

    const user = await User.findOne({username})

    if(!user)
    {
        return send.status(403).json({message: "User Does not exist"})
    }
    if(!(await user.verifyPassword(password)))
    return send.status(403).json({message: "Password is wrong"})
try {
    
        const refreshToken = await generateRefreshToken(user._id)
        const accessToken = await generateAccessToken(user._id)
    
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }
    
        console.log(accessToken, "\n", refreshToken)
    
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({message:"User Succesfully Logged In"})
} catch (error) {
    return res.status(400).json({"message": "Oops! Something went wrong"})
}
})


export {signup, signin}