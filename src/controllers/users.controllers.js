import { User } from "../models/user.models.js";
import { Group } from "../models/group.models.js";
import { Task } from "../models/task.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

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
    return res.status(402).json({message: "Username or Password not Found"})

    const user = await User.findOne({username})

    if(!user)
    {
        return res.status(403).json({message: "User Does not exist"})
    }
    if(!(await user.verifyPassword(password)))
    return res.status(403).json({message: "Password is wrong"})
try {
    
        const refreshToken = await generateRefreshToken(user._id)
        const accessToken = await generateAccessToken(user._id)
    
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }
    
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({message:"User Succesfully Logged In"}).header(
            "Access-Control-Allow-Credentials", 'true')
} catch (error) {
    return res.status(400).json({"message": "Oops! Something went wrong"})
}
})

const addNewPersonalGroup = asyncHandler(async (req, res) => {
    const {name, aboutGroup} = req.body;
    if(!name)
    {
        return res.status(401).send("No name found")
    }
    try {
        const newGroup = await Group.create({
                name,
                aboutGroup: aboutGroup?aboutGroup:"",
                owner: req.user._id,
                parentGroup: null,
                personal: true,
            })
            return res.status(200).send("New group created!!!")
        }
    catch (error) {
        return res.status(400).send("Something went wrong while creating new group")
    }
})

const addNewTask = asyncHandler(async (req, res) => {
    const {name, details, group} = req.body
    if(!name || !group)
    return res.status(410).send("name or group not present")

try {

    const newTask = Task.create({
        name,
        details: details?details:"",
        group: group,
    })

    return res.status(200).send("New Task Created!!!")

    
} catch (error) {
    return res.status(410).send("Something went wrong while creating new task")
    }
})

const removeGroup = asyncHandler(async (req, res) => {
    const {group} = req.body;

    if(!group)
    {
        return res.status(401).send("No group found")
    }
    try {
        const deletedGroup = await Group.findByIdAndDelete(group)

        if(!deletedGroup)
        return res.status(404).send("group not found")

        return res.status(200).send("Group Deleted!!!")

    }

    catch (error) {
        return res.status(401).send("Something went wrong while deleting group")
    }
})
const removeTask = asyncHandler(async (req, res) => {
    const {task} = req.body;

    if(!task)
    {
        return res.status(401).send("No task found")
    }
    try {
        const deletedTask = await Task.findByIdAndDelete(task)

        if(!deletedTask)
        return res.status(404).send("Task not found")

        return res.status(200).send("Task Deleted!!!")

    }

    catch (error) {
        return res.status(401).send("Something went wrong while deleting task")
    }
})

const updateTask = asyncHandler(async (req, res) => {
    const {task, name, details, completed} = req.body

    if(!name || !task)
    {
        return res.status(400).send("No Name or task found")
    }
    
    try {
        const updateTask = await Task.findByIdAndUpdate(task, {name, details, completed})
        
        return res.status(200).send("Task Updated")
    } catch (error) {
        return res.status(410).send("Something went wrong while updating Task")
    }


})

const enlistTask = asyncHandler(async (req, res) => {
    const {group} = req.body
    try {
        const tasks = await Task.find({
            group,
        }).select("-createdAt -updatedAt -__v")

        
        return res.status(200).json(tasks)
    
    } catch (error) {
        return res.status(400).send("Something went wrong while finding tasks")
    }

})

const enlistGroup = asyncHandler(async (req, res) => {
    const {_id} = req.user

    try {
        const groups = await Group.find({
            owner: _id,
            personal: true,
        })

        return res.status(200).json(groups)
    } catch (error) {
        return res.status(404).send("groups not found");
    }
})

const editGroup = asyncHandler(async (req, res) => {
    const {group, name, aboutGroup} = req.body

    if(!group)
    {
        return res.status(404).send("group not found");
    }
    
    try {

        const groupss = await Group.findByIdAndUpdate(group, {
            name,
            aboutGroup
        })

        return res.status(200).send("Group updated");
        
    } catch (error) {
        return res.status(400).send("Something went wrong!!");
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const {oldP, newP} = req.body
    if(newP=="")
    return res.status(400).send("empty password")

    const user = await User.findById(req.user._id)

    if(oldP != user.password)
    {
        return res.status(401).send("not allowed");
    }


    user.password = newP

    await user.save()
})

const profile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    return res.status(200).json({
        name: user.name,
        email: user.email
    })
})

const logout = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)

    user.refreshToken = "";
    user.accessToken = "";

    await user.save({validateBeforeSave:false})

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res.status(200).cookie("accessToken", "", options).cookie("refreshToken", "", options).send("User Succesfully Logged In")
})

export {signup, signin, addNewPersonalGroup, addNewTask, removeGroup, updateTask, enlistTask, enlistGroup, removeTask, editGroup, changePassword, profile, logout}