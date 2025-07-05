import { useActionData } from "react-router-dom";
import { Group } from "../models/group.models.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from 'mongoose';



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
    if(!(Group.find({
        _id: group,
        members: {
            $elemMatch: {
                user: req.user._id,
        }
    }
    })))
    return res.status(401).send("Access Denied")
    
    try {
        const tasks = await Task.find({
            group,
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

    if (!(await Group.findOne({
        _id: group,
        members: {
            $elemMatch: {
                user: req.user._id,
                permission: 2
            }
        }
    }))) {
        return res.status(401).send("Access Denied")
    }

    try {

        const newTask = await Task.create({
            name,
            details: details ? details : "",
            group,
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
                user: req.user._id,
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

const removeGroup = asyncHandler(async (req, res) =>{
    const {group} = req.body;
    const foundGroup = await Group.findById(group);

    if(foundGroup.owner.toString()!=req.user._id.toString())
    {
        return res.status(400).send("hshshsshshsh");
    }
    
    await Group.findByIdAndDelete(group);
    
    return res.status(200).send("Group deleted");
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

const checkOwner = asyncHandler(async (req, res) => {
    const { group } = req.body

    const foundGroup = await Group.findById(group);
    if(!foundGroup)
    return res.status(404).send("group not found")

    const ans = (foundGroup.owner.toString()==req.user._id.toString())
    return res.status(200).json({
        isOwner: ans
    })
})

const joinGroup = asyncHandler(async (req, res) => {
    const { group } = req.body;

    const foundGroup = await Group.findById(group);

    if (!foundGroup || foundGroup.personal != false) {
        return res.status(404).json({ message: "Group not found" });
    }

    
    const isMember = foundGroup.members.some((obj)=>{
        obj.name == req.user._id
    })

    if (isMember) {
        return res.status(201).json({ message: "User is already a member of this group" });
    }

    
    foundGroup.members.push({
        user: req.user._id,
        permission: "1"
    });

    await foundGroup.save();

    return res.status(200).json({ message: "Joined group successfully", group: foundGroup });
});

const viewMembers = asyncHandler(async (req, res) => {
    const { groupId } = req.body;
  
    if (!groupId) {
      return res.status(400).send("groupId not provided");
    }
  
    // Optional: Validate if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).send("Invalid group ID format");
    }
  
    const group = await Group.findById(groupId).populate('members.user', 'name');
  
    if (!group) {
      return res.status(404).send("Group not found");
    }
  
    const members = group.members.map(member => ({
      id: member.user._id,
      name: member.user.name,
      permission: member.permission
    }));
  
    return res.status(200).json(members);
  });

const updateMemberPermission = asyncHandler(async (req, res) => {
    const { groupId, memberId } = req.body;
    const { permission } = req.body;
  
    if (![0, 1, 2].includes(permission)) {
      return res.status(400).send("Invalid permission value");
    }
  
    const group = await Group.findOne({
      _id: groupId,
      members: {
        $elemMatch: {
          user: req.user._id,
          permission: 2
        }
      }
    });
  
    if (!group) {
      return res.status(403).send("Access denied");
    }
  
    const member = group.members.find(m => m.user.toString() === memberId);
  
    if (!member) {
      return res.status(404).send("Member not found");
    }
  
    member.permission = permission;
    await group.save();
  
    return res.status(200).send("Member permission updated");
});

const removeMember = asyncHandler(async (req, res) => {
    const { groupId, memberId } = req.params;
  
    const group = await Group.findOne({
      _id: groupId,
      members: {
        $elemMatch: {
          user: req.user._id,
          permission: 2
        }
      }
    });
  
    if (!group) {
      return res.status(403).send("Access denied");
    }
  
    const originalLength = group.members.length;
    group.members = group.members.filter(m => m.user.toString() !== memberId);
  
    if (group.members.length === originalLength) {
      return res.status(404).send("Member not found");
    }
  
    await group.save();
    return res.status(200).send("Member removed");
});

const updateTask = asyncHandler(async (req, res) => {
    const { task: taskId, name, details, completed } = req.body;
  
    if (!name || !taskId) {
      return res.status(400).send("No name or task found");
    }
  
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send("Invalid task ID");
    }
  

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }
  

    const group = await Group.findById(task.group);
    if (!group) {
      return res.status(404).send("Group not found");
    }
  

    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
  
    if (!member || (member.permission == 0)) {
      return res.status(403).send("You do not have permission to update this task");
    }
  

    task.name = name;
    task.details = details || "";
    if (typeof completed === "boolean") task.completed = completed;
  
    await task.save();
  
    return res.status(200).send("Task updated successfully");
});
  



export { addNewGroup, enlistGroup, enlistTask, addNewTask, removeTask, checkPermission, joinGroup, viewMembers, updateMemberPermission, removeMember, updateTask, checkOwner, removeGroup }