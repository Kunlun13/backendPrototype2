import { useActionData } from "react-router-dom";
import { Group } from "../models/group.models.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";


const addNewGroup = asyncHandler(async (req, res) => {
    const { name, aboutGroup } = req.body

    if (!req.user._id || !name) {
        return res.status(404).send("No user or group name found")
    }

    try {
        const newGroup = await Group.create({
            name,
            aboutGroup: aboutGroup ? aboutGroup : "",
            owner: req.user._id,
            members: [
                {
                    user: req.user._id,
                    permission: 2,
                }
            ],
            personal: false,
        })
        return res.status(200).send("New group created")
    } catch (error) {
        return res.status(400).send("Something went wrong")

    }
})

const enlistGroup = asyncHandler(async (req, res) => {
    const { _id } = req.user

    if (!_id)
        return res.status(404).send("Users not found");


    try {
        const groups = await Group.find({
            owner: _id,
            personal: false,
            members: {
                $elemMatch: {
                    user: _id,
                }
            },
        })

        return res.status(200).json(groups)
    } catch (error) {
        return res.status(404).send("groups not found");
    }
})

const enlistTask = asyncHandler(async (req, res) => {
    const { group } = req.body
    try {
        const tasks = await Task.find({
            group,
            members: {
                $elemMatch: {
                    name: _id,
                }
            }
        }).select("-createdAt -updatedAt -__v")


        return res.status(200).json(tasks)

    } catch (error) {
        return res.status(400).send("Something went wrong while finding tasks")
    }

})

const addNewTask = asyncHandler(async (req, res) => {
    const { name, details, group } = req.body
    if (!name || !group)
        return res.status(410).send("name or group not present")

    if (!(await Group.find({
        _id: group,
        members: {
            $elemMatch: {
                name: _id,
                permission: 2
            }
        }
    }))) {
        return res.status(401).send("Access Denied")
    }

    try {

        const newTask = Task.create({
            name,
            details: details ? details : "",
            group: group,
        })

        return res.status(200).send("New Task Created!!!")


    } catch (error) {
        return res.status(410).send("Something went wrong while creating new task")
    }
})

const removeTask = asyncHandler(async (req, res) => {
    const { task, group } = req.body;

    if (!task || !group) {
        return res.status(404).send("No task or group found")
    }
    if (!(group && (await Group.find({
        _id: group,
        members: {
            $elemMatch: {
                name: req.user._id,
                permission: 2
            }
        }
    })) && Task.find({
        _id: task,
        group
    })))
        return res.status(401).send("Access Denied")

    try {
        const deletedTask = await Task.deleteOne({
            _id: task,
        })

        if (!deletedTask)
            return res.status(404).send("Task not found")

        return res.status(200).send("Task Deleted!!!")

    }

    catch (error) {
        return res.status(401).send("Something went wrong while deleting task")
    }
})

const checkPermission = asyncHandler(async (req, res) => {
    const { group } = req.body

    const userDetail0 = await Group.find({
        _id: group,
        members: {
            $elemMatch:{
                name: req.user._id,
                permission: "0",
            }
        }
    })
    const userDetail1 = await Group.find({
        _id: group,
        members: {
            $elemMatch:{
                name: req.user._id,
                permission: "1",
            }
        }
    })
    const userDetail2 = await Group.find({
        _id: group,
        members: {
            $elemMatch:{
                name: req.user._id,
                permission: "2",
            }
        }
    })

    if (userDetail0)
        return res.status(200).json({
            permission: "0", 
        })
    if (userDetail1)
        return res.status(200).json({
            permission: "1", 
        })
    if (userDetail2)
        return res.status(200).json({
            permission: "2", 
        })
        return res.status(200).json({
            permission: "-1", 
        })
})

export { addNewGroup, enlistGroup, enlistTask, addNewTask, removeTask, checkPermission }