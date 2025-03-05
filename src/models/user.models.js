import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";


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
}, 
{ timestamps: true})

userSchema.pre("save", async function (next){
    if(!this.isModified("password"))
    return next()

    this.password = await bcrypt.hash(this.password, 10)

    return next()
})


export const User = mongoose.model("User", userSchema)