const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const {
  loginValidation,
  userIdValidation,
} = require("../../middleware/joi.middleware");
const authMiddleware = require("../../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API operations related to auth
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and generate a JWT token for authorization.
 *     tags: [Auth]
 *     parameters:
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *         description: The email of the user.
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *         description: The password of the user.
 *     responses:
 *       200:
 *         description: JWT token generated successfully.
 *         content:
 *           application/json:
 *             example:
 *               token: "your-generated-token"
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid credentials.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error.
 */
router.post("/login", loginValidation, authController.login);

/**
 * @swagger
 * /api/auth/logout/{userId}:
 *   get:
 *     summary: Logout user
 *     description: Logout user.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Logout successfully.
 *         content:
 *           application/json:
 *             example:
 *               token: "your-generated-token"
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid credentials.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error.
 */
router.get(
  "/logout/:userId",
  authMiddleware,
  userIdValidation,
  authController.logout
);

/** below API are used for UI purpose */
router.post("/userLogin", loginValidation, authController.userLogin);
router.get("/userlogout", authController.userlogout);
/** above API are used for UI purpose  */

module.exports = router;
