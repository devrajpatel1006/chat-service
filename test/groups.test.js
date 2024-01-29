const chai = require("chai");
const axios = require("axios");
const { authTokenPromise } = require("./auth.test");
require("dotenv").config();
const expect = chai.expect;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8082";

let groupId;
describe("Groups API Tests", () => {
  let authToken;
  before(async () => {
    authToken = await authTokenPromise;
  });

  it("should add a new group", async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/groups/add`,
        {
          groupName: "Test Group" + Date.now(),
          groupAdminId: authToken.id,
        },
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 201) {
        expect(response.data.status).to.equal(true);
        expect(response.data.data).to.be.an("object");
        // Extract group ID
        groupId = response.data.data._id;
      } else if (response.status === 400) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal(
          "Invalid Group Admin ID format."
        );
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Group admin not found.");
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      expect.fail(`Unexpected error: ${error.message}`);
    }
  });

  it("should search for groups", async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/groups/search`,
        {
          groupName: "Test",
          userId: authToken.id,
        },
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.data.status).to.equal(true);
        expect(response.data.message).to.equal(
          "Groups retrieved successfully."
        );
      } else if (response.status === 400) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid parameters.");
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid userId.");
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response && error.response.status === 404) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal("Invalid userId.");
      } else {
        throw error;
      }
    }
  });

  it("should add a member to a group", async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/groups/members/add`,
        {
          groupId: groupId,
          memberUserId: authToken.id,
          groupAdminId: authToken.id,
        },
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 201) {
        expect(response.data.status).to.equal(true);
        expect(response.data.message).to.equal("Member added successfully.");
      } else if (response.status === 400) {
        if (
          response.data.message === "Invalid parameters." ||
          response.data.message === "Member is already part of the group."
        ) {
          // You can have separate expectations for each case
          expect(response.data.status).to.equal(false);
          expect(response.data.message).to.equal("Invalid parameters.");
          // or
          // expect(response.data.message).to.equal("Member is already part of the group.");
        } else {
          // Handle unexpected message for 400 status code
          expect.fail(
            `Unexpected message for 400 status code: ${response.data.message}`
          );
        }
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid Member ID.");
      } else if (response.status === 403) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal(
          "You do not have permission to add members to this group."
        );
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response && error.response.status === 404) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal("Invalid Member ID.");
      } else if (error.response.status === 400) {
        if (
          error.response.data.message === "Invalid parameters." 
        ) {
          expect(error.response.data.status).to.equal(false);
          expect(error.response.data.message).to.equal("Invalid parameters.");
        } else {
          expect(error.response.data.status).to.equal(false);
          expect(error.response.data.message).to.equal("Member is already part of the group.");
        }
      } else {
        expect.fail(
          `Unexpected message for 400 status code: ${error.response.data.message}`
        );
      }
    }
  });

  it("should get user's groups by user ID", async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/groups/getUsersGroups/${authToken.id}`,
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.data.status).to.equal(true);
        expect(response.data.message).to.equal(
          "User's groups retrieved successfully."
        );
      } else if (response.status === 400) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid User ID format.");
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("User not found.");
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response && error.response.status === 404) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal("User not found.");
      } else {
        throw error;
      }
    }
  });

  it("should get all members of a group", async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/groups/getGroupAllMembers/${groupId}`,
        {
          userId: authToken.id,
        },
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.data.status).to.equal(true);
        expect(response.data.message).to.equal(
          "Users in the group retrieved successfully."
        );
      } else if (response.status === 400) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid parameters.");
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Group not found.");
      } else if (response.status === 403) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal(
          "User is not a member of the group."
        );
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response && error.response.status === 403) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal(
          "User is not a member of the group."
        );
      } else {
        throw error;
      }
    }
  });

  let messageId;

  it("should send a message", async function () {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/sendMessage`,
        {
          groupId: groupId,
          userId: authToken.id,
          message: "Hello, this is a test message.",
        },
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 201) {
        expect(response.data.status).to.equal(true);
        expect(response.data.message).to.equal("Message sent successfully.");
      } else if (response.status === 400) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid parameters.");
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Group not found.");
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }

      // Extract message ID
      messageId = response.data.data._id;
    } catch (error) {
      // Handle unexpected errors
      if (error.response && error.response.status === 404) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal("Group not found.");
      } else {
        throw error;
      }
    }
  });

  it("should get group messages", async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/getGroupMessages/${groupId}`,
        {
          userId: authToken.id,
        },
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.data.status).to.equal(true);
        expect(response.data.message).to.equal(
          "Messages retrieved successfully."
        );
        expect(response.data.data).to.be.an("array");
      } else if (response.status === 400) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid parameters.");
      } else if (response.status === 403) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal(
          "User is not a member of the group."
        );
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response && error.response.status === 403) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal(
          "User is not a member of the group."
        );
      } else {
        throw error;
      }
    }
  });

  it("should like/unlike a message", async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/likeUnlikeMessage`,
        {
          messageId: messageId,
          userId: authToken.id,
        },
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.data.success).to.equal(true);
        expect(response.data.message).to.have.property("like_count");
      } else if (response.status === 400) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid parameters.");
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Message not found.");
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response && error.response.status === 404) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal("Message not found.");
      } else {
        throw error;
      }
    }
  });

  it("should delete a group", async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/groups/delete`,
        {
          groupId: groupId,
          groupAdminId: authToken.id,
        },
        {
          headers: { Authorization: authToken.token },
        }
      );

      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.data.status).to.equal(true);
        expect(response.data.message).to.equal("Group deleted successfully.");
      } else if (response.status === 400) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid parameters.");
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal(
          "Group not found or already deleted."
        );
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response && error.response.status === 404) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal(
          "Group not found or already deleted."
        );
      } else {
        throw error;
      }
    }
  });
});
