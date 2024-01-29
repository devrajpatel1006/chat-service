const Groups = require("../models/groups.model");
const GroupMembers = require("../models/groupMembers.model");
const mongoose = require("mongoose");

exports.addGroup = async (req, res) => {
  try {
    const { groupName, groupAdminId } = req.body;

    // Check if groupAdminId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupAdminId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Group Admin ID format.",
        data: [],
      });
    }

    // Check if the user (group admin) exists
    const existingUser = await Users.findById(groupAdminId);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "Group admin not found.",
        data: [],
      });
    }

    const newGroup = new Groups({
      group_name: groupName,
      group_admin_id: groupAdminId,
    });

    const savedGroup = await newGroup.save();

    // Create an entry for the group admin in the GroupMembers collection
    const newGroupMember = new GroupMembers({
      group_id: savedGroup._id,
      user_id: groupAdminId,
      is_admin: 1, // Assuming the default value for is_admin is 1 for group admin
    });

    await newGroupMember.save();

    res.status(201).json({
      status: true,
      message: "Group added successfully.",
      data: savedGroup,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId, groupAdminId } = req.body;

    // Check if parameters are a valid ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(groupAdminId)
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid parameters.",
        data: [],
      });
    }

    // Check if the user (group admin) exists
    const existingUser = await Users.findById(groupAdminId);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "Invalid Group admin ID.",
        data: [],
      });
    }

    // Check if the group exists
    const existingGroup = await Groups.findOne({
      _id: groupId,
      is_deleted: 0,
      group_admin_id: groupAdminId,
    });

    if (!existingGroup) {
      return res.status(404).json({
        status: false,
        message: "Group not found or already deleted.",
        data: [],
      });
    }

    // Update is_deleted field to 1 instead of hard deleting
    const updatedGroup = await Groups.findByIdAndUpdate(
      groupId,
      { is_deleted: 1 },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Group deleted successfully.",
      data: updatedGroup,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.searchGroup = async (req, res) => {
  try {
    const { groupName, userId } = req.body;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid parameters.",
        data: [],
      });
    }

    // Check if the user exists
    const existingUser = await Users.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "Invalid userId.",
        data: [],
      });
    }

    // Create a filter object based on the provided query parameters
    const filter = {};

    if (groupName) {
      filter.group_name = { $regex: new RegExp(groupName, "i") };
    }

    if (userId) {
      // Use GroupMembers model to find groups with the specified user ID
      const groupIds = await GroupMembers.find({
        user_id: userId,
        is_deleted: 0,
      }).distinct("group_id");
      filter._id = { $in: groupIds };
    }

    filter.is_deleted = 0;

    // Use Groups model to find groups based on the filter
    const groups = await Groups.find(filter);

    res.status(200).json({
      status: true,
      message: "Groups retrieved successfully.",
      data: groups,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.addMemberInGroup = async (req, res) => {
  try {
    const { groupId, memberUserId, groupAdminId } = req.body;

    // Check if parameters are a valid ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(memberUserId) ||
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(groupAdminId)
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid parameters.",
        data: [],
      });
    }

    // Check if the user (group member) exists
    const existingUser = await Users.findById(memberUserId);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "Invalid Member ID.",
        data: [],
      });
    }

    // Check if the group exists
    const existingGroup = await Groups.findOne({
      _id: groupId,
      is_deleted: 0,
    });

    if (!existingGroup) {
      return res.status(404).json({
        status: false,
        message: "Group not found.",
        data: [],
      });
    }

    // Check if the logged-in user is an admin of the group
    const isAdmin = await GroupMembers.exists({
      group_id: groupId,
      user_id: groupAdminId,
      is_admin: 1, // Assuming the value for admin is 1
      is_deleted: 0,
    });

    if (!isAdmin) {
      return res.status(403).json({
        status: false,
        message: "You do not have permission to add members to this group.",
        data: [],
      });
    }

    // Check if the member is already part of the group
    const isMemberAlreadyAdded = await GroupMembers.exists({
      group_id: groupId,
      user_id: memberUserId,
      is_deleted: 0,
    });

    if (isMemberAlreadyAdded) {
      return res.status(400).json({
        status: false,
        message: "Member is already part of the group.",
        data: [],
      });
    }

    // Create a new GroupMembers document
    const newGroupMember = new GroupMembers({
      group_id: groupId,
      user_id: memberUserId,
      is_admin: 0, // Assuming the default value for is_admin is 0
    });

    // Save the new member to the database
    const savedGroupMember = await newGroupMember.save();

    res.status(201).json({
      status: true,
      message: "Member added successfully.",
      data: savedGroupMember,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.getUsersGroupsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid User ID format.",
        data: [],
      });
    }

    // Check if the user exists
    const existingUser = await Users.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
        data: [],
      });
    }

    // Find all groups associated with the user
    const userGroups = await GroupMembers.find({
      user_id: userId,
      is_deleted: 0,
    })
      .populate({
        path: "group_id",
        model: Groups,
        select: "group_name",
      })
      .exec();

    res.status(200).json({
      status: true,
      message: "User's groups retrieved successfully.",
      data: userGroups,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.getGroupAllMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    // Validate parameters
    if (
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid parameters.",
        data: [],
      });
    }

    // Check if the group exists
    const existingGroup = await Groups.findById(groupId);
    if (!existingGroup) {
      return res.status(404).json({
        status: false,
        message: "Group not found.",
        data: [],
      });
    }

    // Check if the user exists
    const existingUser = await Users.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
        data: [],
      });
    }

    // Check if the user is a member of the group
    const isMember = await GroupMembers.exists({
      group_id: groupId,
      user_id: userId,
      is_deleted: 0,
    });

    if (!isMember) {
      return res.status(403).json({
        status: false,
        message: "User is not a member of the group.",
        data: [],
      });
    }

    // Find all users in the group
    const groupMembers = await GroupMembers.find({
      group_id: groupId,
      is_deleted: 0,
    })
      .populate({
        path: "user_id",
        model: Users,
        select: "userName isAdmin email",
      })
      .exec();

    res.status(200).json({
      status: true,
      message: "Users in the group retrieved successfully.",
      data: groupMembers,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};
