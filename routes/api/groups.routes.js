const express = require("express");
const router = express.Router();
const groupsController = require("../../controllers/groups.controller");
const {
  addUserValidation,
  validateUserID,
  editUserValidation,
  addGroupValidation,
  deleteGroupValidation,
  searchGroupValidation,
  addMemberInGroupValidation,
  userIdValidation,
  groupIdValidation,
  userIdBodyValidation,
} = require("../../middleware/joi.middleware");

/**
 * @swagger
 * /api/groups/add:
 *   post:
 *     summary: Add a new group
 *     description: Add a new group with the provided details.
 *     tags: [Groups]
 *     parameters:
 *       - in: formData
 *         name: groupName
 *         type: string
 *         required: true
 *         description: The Name of the group.
 *       - in: formData
 *         name: groupAdminId
 *         type: string
 *         required: true
 *         description: The UserID of the user.
 *     responses:
 *       201:
 *         description: Group Added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group added successfully.
 *               data: { id: 1, groupName: 'groupAdminId' }
 *       400:
 *         description: Group already exists.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group already exists.
 *               data: []
 *       404:
 *         description: Group admin not found..
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group admin not found..
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
router.post("/add", addGroupValidation, groupsController.addGroup);

/**
 * @swagger
 * /api/groups/delete:
 *   post:
 *     summary: Delete a group
 *     description: Delete a group with the provided details.
 *     tags: [Groups]
 *     parameters:
 *       - in: formData
 *         name: groupId
 *         type: string
 *         required: true
 *         description: The ID of the group.
 *       - in: formData
 *         name: groupAdminId
 *         type: string
 *         required: true
 *         description: The UserID of the user.
 *     responses:
 *       201:
 *         description: Group Deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group deleted successfully.
 *               data: []
 *       400:
 *         description: Invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Invalid parameters.
 *               data: []
 *       404:
 *         description: Invalid Group admin ID.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Invalid Group admin ID.
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
router.post("/delete", deleteGroupValidation, groupsController.deleteGroup);

/**
 * @swagger
 * /api/groups/search:
 *   post:
 *     summary: Search a group
 *     description: Search a group with the provided details.
 *     tags: [Groups]
 *     parameters:
 *       - in: formData
 *         name: groupName
 *         type: string
 *         description: The name of the group.
 *       - in: formData
 *         name: userId
 *         type: string
 *         required: true
 *         description: The userId of the user.
 *     responses:
 *       201:
 *         description: Group Found successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group Found successfully.
 *               data: []
 *       400:
 *         description: Invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Invalid parameters.
 *               data: []
 *       404:
 *         description: Invalid userId.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Invalid userId.
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
router.post("/search", searchGroupValidation, groupsController.searchGroup);

/**
 * @swagger
 * /api/groups/members/add:
 *   post:
 *     summary: Add member in the group
 *     description: Add member in the group with the provided details.
 *     tags: [Groups]
 *     parameters:
 *       - in: formData
 *         name: groupId
 *         type: string
 *         description: The Group Id of the group.
 *       - in: formData
 *         name: memberUserId
 *         type: string
 *         required: true
 *         description: The UserID of the member user.
 *       - in: formData
 *         name: groupAdminId
 *         type: string
 *         required: true
 *         description: The UserID of the login user.
 *     responses:
 *       201:
 *         description: Member added successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Member added successfully.
 *               data: []
 *       400:
 *         description: Invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Invalid parameters.
 *               data: []
 *       403:
 *         description: You do not have permission to add members to this group.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: You do not have permission to add members to this group.
 *               data: []
 *       404:
 *         description: Invalid parameters Id.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Invalid Member ID/Group not found.
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
router.post(
  "/members/add",
  addMemberInGroupValidation,
  groupsController.addMemberInGroup
);

/**
 * @swagger
 * /api/groups/getUsersGroups/{userId}:
 *   get:
 *     summary: Get users all groups
 *     description: Get users all groups with the provided details.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: userId
 *         type: string
 *         description: The UserID Id of the group.
 *     responses:
 *       201:
 *         description: Groups fetch successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Groups fetch successfully.
 *               data: []
 *       400:
 *         description: Invalid User ID format.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Invalid User ID format.
 *               data: []
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               status: true
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
router.get(
  "/getUsersGroups/:userId",
  userIdValidation,
  groupsController.getUsersGroupsByUserId
);

/**
 * @swagger
 * /api/groups/getGroupAllMembers/{groupId}:
 *   post:
 *     summary: Get all members of the group
 *     description: Get all members of the group with the provided details.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         type: string
 *         description: The Id of the group.
 *       - in: formData
 *         name: userId
 *         type: string
 *         required: true
 *         description: The id of the user.
 *     responses:
 *       201:
 *         description: Group members fetch successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group members fetch successfully.
 *               data: []
 *       400:
 *         description: Invalid parameters.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Invalid parameters.
 *               data: []
 *       403:
 *         description: User is not a member of the group.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: User is not a member of the group.
 *               data: []
 *       404:
 *         description: Group not found.
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Group not found.
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
router.post(
  "/getGroupAllMembers/:groupId",
  groupIdValidation,
  userIdBodyValidation,
  groupsController.getGroupAllMembers
);

module.exports = router;
