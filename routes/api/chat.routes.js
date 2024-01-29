const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chat.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  sendMessageValidation,
  groupIdValidation,
  likeUnlikeMessageValidation,
  userIdBodyValidation,
} = require("../../middleware/joi.middleware");

/**
 * @swagger
 * /api/chat/sendMessage:
 *   post:
 *     summary: Send message in the group
 *     description: Send message in the group with the provided details.
 *     tags: [Chat]
 *     parameters:
 *       - in: formData
 *         name: groupId
 *         type: string
 *         required: true
 *         description: The Id of the group.
 *       - in: formData
 *         name: userId
 *         type: string
 *         required: true
 *         description: The UserID of the user.
 *       - in: formData
 *         name: message
 *         type: string
 *         required: true
 *         description: Enter message.
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message:  Message sent successfully.
 *               data: {  }
 *       400:
 *         description: Invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message:  Invalid parameters.
 *               data: {  }
 *       404:
 *         description: User/Group Not found.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message:  User/Group not found.
 *               data: {  }
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Internal Server Error.
 *               data: []
 */
router.post(
  "/sendMessage",
  authMiddleware,
  sendMessageValidation,
  chatController.sendMessage
);

/**
 * @swagger
 * /api/chat/getGroupMessages/{groupId}:
 *   post:
 *     summary: Get group messages
 *     description: Get group messages with the provided details.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         type: string
 *         required: true
 *         description: The Id of the group.
 *       - in: formData
 *         name: userId
 *         type: string
 *         required: true
 *         description: The UserId of the user.
 *     responses:
 *       201:
 *         description: Messages sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message:  Message sent successfully.
 *               data: {  }
 *       400:
 *         description: Invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message:  Invalid parameters.
 *               data: {  }
 *       403:
 *         description: User is not a member of the group.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message:  User is not a member of the group.
 *               data: {  }
 *       404:
 *         description: User/Group Not found.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message:  User/Group not found.
 *               data: {  }
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Internal Server Error.
 *               data: []
 */
router.post(
  "/getGroupMessages/:groupId",
  authMiddleware,
  groupIdValidation,
  userIdBodyValidation,
  chatController.getGroupMessages
);

/**
 * @swagger
 * /api/chat/likeUnlikeMessage:
 *   post:
 *     summary: Like unlike messages
 *     description: Like unlike message with the provided details.
 *     tags: [Chat]
 *     parameters:
 *       - in: formData
 *         name: messageId
 *         type: string
 *         required: true
 *         description: The Id of the message.
 *       - in: formData
 *         name: userId
 *         type: string
 *         required: true
 *         description: The Id of the user.
 *     responses:
 *       201:
 *         description: Messages like/unlike successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message:  Message like/unlike successfully.
 *               data: {  }
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Internal Server Error.
 *               data: []
 */
router.post(
  "/likeUnlikeMessage",
  authMiddleware,
  likeUnlikeMessageValidation,
  chatController.likeUnlikeMessage
);

router.get("/", (req, res) => {
  const userDataCookie = req.cookies.userData;
  if (userDataCookie) {
    const userData = userDataCookie;
    res.render("home", { user: userData });
  } else {
    // Handle the case where the cookie is not present
    res.render("index");
  }
});
module.exports = router;
