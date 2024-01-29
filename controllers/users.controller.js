const mongoose = require("mongoose");
const Users = require("../models/users.model");
const bcrypt = require("bcryptjs");

exports.list = async (req, res) => {
  try {
    const users = await Users.find();
    return res.status(200).json({
      status: true,
      message: "Record fetch successfully.",
      data: users,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, error: error.message, data: [] });
  }
};

exports.add = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: true,
        message: "User already exists.",
        data: existingUser,
      });
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new Users({
      password: hashedPassword,
      username,
      email,
      role,
    });

    // Save the user to the database
    let newInsertedUser = await newUser.save();

    res.status(201).json({
      status: true,
      message: "User added successfully.",
      data: newInsertedUser,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.edit = async (req, res) => {
  try {
    const { userID } = req.params;
    const { username, password, role } = req.body;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({
        status: false,
        message: "Invalid userId.",
        data: [],
      });
    }

    // Check if the user with the given ID exists
    const existingUser = await Users.findById(userID);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
        data: [],
      });
    }

    // Update user properties
    existingUser.username = username;
    existingUser.role = role;

    // Check if the password is provided for update
    if (password) {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);

      // Hash the new password using the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update the password
      existingUser.password = hashedPassword;
    }

    // Save the updated user to the database
    const updatedUser = await existingUser.save();

    res.status(200).json({
      status: true,
      message: "User updated successfully.",
      data: updatedUser
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: false,
      message: error.message,
      data: [],
    });
  }
};
