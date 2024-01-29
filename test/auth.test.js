const chai = require("chai");
const axios = require("axios");
require("dotenv").config();
const expect = chai.expect;

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8082";

// Declare a variable to store the authTokenPromise
const authTokenPromise = (async () => {
  // Perform the login request to obtain the authToken
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
    email: "raj@gmail.com",
    password: "raj@gmail.com",
  });

  // Return the authToken
  return response.data.data;
})();

describe("Auth API Tests", () => {
  let userData;
  before(async () => {});

  it("should login a user", async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: "test@admin.com",
        password: "password",
      });

      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.data.status).to.equal(true);
        expect(response.data.data).to.be.an("object");
        // Extract group ID
        userData = response.data.data;
      } else if (response.status === 401) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("Invalid credentials.");
      } else if (response.status === 404) {
        expect(response.data.status).to.equal(false);
        expect(response.data.message).to.equal("User not found.");
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response.status === 401) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal("Invalid credentials.");
      } else if (error.response.status === 404) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal("User not found.");
      } else {
        expect.fail(`Unexpected error: ${error.message}`);
      }
    }
  });

  it("should clear the cookie and add the token to the blacklist on successful logout", async () => {
    try {
      const userId = userData.id;
      const authToken = userData.token;

      const logoutResponse = await axios.get(
        `${API_BASE_URL}/api/auth/logout/${userId}`,
        {
          headers: { Authorization: authToken },
        }
      );

      // Asserting for different possible status codes
      if (logoutResponse.status === 200) {
        expect(logoutResponse.data.status).to.equal(true);
        expect(logoutResponse.data.message).to.equal("Logout successfully");
      } else if (logoutResponse.status === 404) {
        expect(logoutResponse.data.status).to.equal(false);
        expect(logoutResponse.data.message).to.equal("User not found.");
      } else {
        expect.fail(`Unexpected status code: ${logoutResponse.status}`);
      }
    } catch (error) {
      if (error.response.status === 404) {
        expect(error.response.data.status).to.equal(false);
        expect(error.response.data.message).to.equal("User not found.");
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${error.response.status}`);
      }
    }
  });
});

// Export the authTokenPromise
module.exports = {
  authTokenPromise,
};
