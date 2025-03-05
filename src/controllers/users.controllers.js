import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";


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



export {signup}