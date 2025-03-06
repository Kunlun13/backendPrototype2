import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,
    }
}, 
{ timestamps: true})

userSchema.pre("save", async function (next){
    if(!this.isModified("password"))
    return next()

    this.password = await bcrypt.hash(this.password, 10)

    return next()
})


userSchema.methods.generateAccessToken = async function (){
    return jwt.sign({
        _id: this._id,
        name: this.name,
        username: this.username,
        password: this.password,
    },process.env.ACCESS_TOKEN_SECRET, 
    {expiresIn: process.env.ACCESS_TOKEN_LIFETIME})
}


userSchema.methods.generateRefreshToken = async function (){
    return jwt.sign({
        _id: this._id,
    },process.env.REFRESH_TOKEN_SECRET, 
    {expiresIn: process.env.REFRESH_TOKEN_LIFETIME})
}

userSchema.methods.verifyPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)