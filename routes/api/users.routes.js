const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users.controller");
const {
  addUserValidation,
  validateUserID,
  editUserValidation,
} = require("../../middleware/joi.middleware");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 *         content:
 *           application/json:
 *             example:
 *               users: []
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
router.get("/", usersController.list);

/**
 * @swagger
 * /api/users/add:
 *   post:
 *     summary: Add a new user
 *     description: Add a new user with the provided details.
 *     tags: [Users]
 *     parameters:
 *       - in: formData
 *         name: username
 *         type: string
 *         required: true
 *         description: The username of the user.
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *         description: The Email of the user.
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *       - in: formData
 *         name: role
 *         type: string
 *         enum: [admin, user]  # Specify the role as either 'admin' or 'user'
 *         required: true
 *         description: The role of the user (admin or user).
 *     responses:
 *       201:
 *         description: User added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User added successfully.
 *               data: { id: 1, username: 'exampleUser', isAdmin: true }
 *       400:
 *         description: User already exists.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User already exists.
 *               data: []
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Internal Server Error.
 *               data: []
 *     security:
 *       - jwt: [admin]  # Specify the roles required to access this endpoint

 */
router.post("/add", addUserValidation, usersController.add);

/**
 * @swagger
 * /api/users/edit/{userID}:
 *   patch:
 *     summary: Edit a user
 *     description: Edit a user with the provided details.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: ID of the user to edit.
 *         schema:
 *         type: string
 *       - in: formData
 *         name: username
 *         type: string
 *         required: true
 *         description: The new username of the user.
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *         description: The new password of the user.
 *       - in: formData
 *         name: role
 *         type: string
 *         enum: [admin, user]  # Specify the role as either 'admin' or 'user'
 *         required: true
 *         description: The role of the user (admin or user).
 *     responses:
 *       201:
 *         description: Information updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Information updated successfully.
 *               data: { id: 1, username: 'exampleUser' }
 *       400:
 *         description: Invalid userId.
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Invalid userId.
 *               data: []
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: User not found.
 *               data: []
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Internal Server Error.
 *               data: []
 */
router.patch(
  "/edit/:userID",
  validateUserID,
  editUserValidation,
  usersController.edit
);

module.exports = router;
