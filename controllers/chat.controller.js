const Groups = require("../models/groups.model");
const GroupMembers = require("../models/groupMembers.model");
const Users = require("../models/users.model");
const Messages = require("../models/messages.model");
const mongoose = require("mongoose");
const messageLikes = require("../models/messageLikes.model");

exports.sendMessage = async (req, res) => {
  try {
    const { groupId, userId, message } = req.body;
    // Check if parameters are a valid ObjectId
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

    // Check if the user (group member) exists
    const existingUser = await Users.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
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

    // Create a new message
    const newMessage = new Messages({
      group_id: groupId,
      user_id: userId,
      message,
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    res.status(201).json({
      status: true,
      message: "Message sent successfully.",
      data: savedMessage,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.getGroupMessages = async (req, res) => {
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

    // Find messages by groupId
    const messages = await Messages.find({ group_id: groupId, is_deleted: 0 })
      .sort({ created_at: 1 }) // Sort by created_at in ascending order
      .populate({
        path: "user_id",
        model: Users,
        select: "username", // Choose the fields you want to retrieve
      })
      .exec();

    res.status(200).json({
      status: true,
      message: "Messages retrieved successfully.",
      data: messages,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.likeUnlikeMessage = async (req, res) => {
  try {
    const { action } = req.body;
    const message_id = req.body.messageId;
    const user_id = req.body.userId;

    // Validate message_id and user_id
    if (
      !mongoose.Types.ObjectId.isValid(message_id) ||
      !mongoose.Types.ObjectId.isValid(user_id)
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid parameters.",
        data: [],
      });
    }

    // Check if the user (group member) exists
    const existingUser = await Users.findById(user_id);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "Invalid userID.",
        data: [],
      });
    }

    // Check if the message exists
    const existingMessage = await Messages.findById(message_id);

    if (!existingMessage) {
      return res.status(404).json({
        status: false,
        message: "Message not found.",
        data: [],
      });
    }

    // Check if the user has already liked the message
    const existingLike = await messageLikes.findOne({ user_id, message_id });
    if (existingLike) {
      if (existingLike.status == 1) {
        // If the user has already liked the message, update the like status to unlike
        existingLike.status = 0; // 0: Unlike
        await existingLike.save();

        // Decrease like_count in the messages collection
        existingMessage.like_count -= 1;
      } else {
        // If the user has already unliked the message, update the unlike status to like
        existingLike.status = 1; // 0: Unlike
        await existingLike.save();

        // Increase like_count in the messages collection
        existingMessage.like_count += 1;
      }
    } else {
      // If the user hasn't liked the message, create a new like
      const newLike = new messageLikes({ user_id, message_id, status: 1 }); // 1: Like
      await newLike.save();

      // Increase like_count in the messages collection
      existingMessage.like_count += 1;
    }

    // Save the updated like_count in the messages collection
    await existingMessage.save();

    res.json({ success: true, message: existingMessage });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};
