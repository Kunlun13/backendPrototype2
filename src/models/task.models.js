import mongoose, { Schema } from "mongoose";


const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    details: {
        type: String,
        trim: true,
    },
    group: {
        type: Schema.Types.ObjectId,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    parentTask: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        default: null,
    }
},
{timestamps: true})


export const Task = mongoose.model("Task", taskSchema)