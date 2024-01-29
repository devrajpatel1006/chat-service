const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users.model");
const { addToBlacklist } = require("../config/tokenBlacklist");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found.", data: [] });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials.", data: [] });
    }

    // Create and send a JWT token for authentication
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.cookie(
          "userData",
          {
            token,
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
          },
          { httpOnly: true, maxAge: process.env.COOKIE_Expire_TIME }
        );

        return res.json({
          status: true,
          message: "Login successful.",
          data: {
            token,
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
          },
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found.", data: [] });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials.", data: [] });
    }

    // Create and send a JWT token for authentication
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.cookie(
          "userData",
          {
            token,
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
          },
          { httpOnly: true, maxAge: process.env.COOKIE_Expire_TIME }
        );

        res.redirect("/api/chat");
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};
exports.logout = async (req, res) => {
  try {
    const userID = req.params.userId;
    // Check if the user with the given ID exists
    const existingUser = await Users.findById(userID);

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
        data: [],
      });
    }

    res.clearCookie("userData");

    // Add the token to the blacklist
    const token = req.header("Authorization");
    addToBlacklist(token);

    return res.json({ status: true, message: "Logout successfully", data: [] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, message: error.message, data: [] });
  }
};

exports.userlogout = async (req, res) => {
  res.clearCookie("userData");
  res.redirect("/");
};
