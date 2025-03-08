import mongoose, { Schema } from "mongoose";

const members = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required:true,
    },
    permission: {
        type: String,
        required: true,
        enum: ["0", "1", "2"]
    }
})

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    aboutGroup: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [members],
    parentGroup: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true
    }

}, {timestamps: true})



export const Group = mongoose.model("Group", groupSchema)