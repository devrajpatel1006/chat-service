const chai = require("chai");
const axios = require("axios");
const { expect } = chai;
require("dotenv").config();
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8082";

describe("User API Tests", () => {
  let authToken;
  let userData;
  before(async () => {});

  describe("POST /api/auth/login", () => {
    it("should login and return an authentication token", async () => {
      const loginCredentials = {
        email: "admin@gmail.com",
        password: "updatedpassword",
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        loginCredentials
      );
      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.data.status).to.equal(true);
        expect(response.data.data).to.have.property("token");
        authToken = response.data.data;
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
    });
  });

  describe("GET /api/users", () => {
    it("should fetch a list of users", async () => {
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: authToken.token,
        },
      });
      // Asserting for different possible status codes
      if (response.status === 200) {
        expect(response.status).to.equal(200);
        expect(response.data.status).to.equal(true);
        expect(response.data.data).to.be.an("array");
      } else {
        // Handle unexpected status codes
        expect.fail(`Unexpected status code: ${response.status}`);
      }
    });
  });

  describe("POST /api/users/add", () => {
    it("should add a new user", async () => {
      const newUser = {
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
        role: "user",
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/users/add`,
          newUser,
          {
            headers: {
              Authorization: authToken.token,
            },
          }
        );

        // Asserting for different possible status codes
        if (response.status === 201) {
          expect(response.data.status).to.equal(true);
          expect(response.data.data).to.be.an("object");
          userData = response.data.data;
        } else if (response.status === 400) {
          expect(response.data.status).to.equal(true);
          expect(response.data.message).to.equal("User already exists.");
          userData = response.data.data;
        } else {
          // Handle unexpected status codes
          expect.fail(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        // Handle unexpected errors
        if (error.response.status === 400) {
          expect(error.response.data.status).to.equal(true);
          expect(error.response.data.message).to.equal("User already exists.");
          userData = error.response.data.data;
        } else {
          expect.fail(`Unexpected status code: ${error.response.status}`);
        }
      }
    });
  });

  describe("PATCH /api/users/edit/:userID", () => {
    it("should edit an existing user", async () => {
      try {
        // Assume you have an existing user ID
        const userID = userData.id == undefined ? userData._id : userData.id;
        const updatedUser = {
          username: "updateduser",
          password: "updatedpassword",
          role: "user",
        };

        const response = await axios.patch(
          `${API_BASE_URL}/api/users/edit/${userID}`,
          updatedUser,
          {
            headers: {
              Authorization: authToken.token,
            },
          }
        );

        // Asserting for different possible status codes
        if (response.status === 200) {
          expect(response.data.status).to.equal(true);
          expect(response.data.data).to.be.an("object");
        } else if (response.status === 400) {
          expect(response.data.status).to.equal(false);
          expect(response.data.message).to.equal("Invalid userId.");
        } else if (response.status === 404) {
          expect(response.data.status).to.equal(false);
          expect(response.data.message).to.equal("User not found.");
        } else {
          // Handle unexpected status codes
          expect.fail(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        if (error.response.status === 400) {
          expect(error.response.data.status).to.equal(false);
          expect(error.response.data.message).to.equal("Invalid userId.");
        } else if (error.response.status === 404) {
          expect(error.response.data.status).to.equal(false);
          expect(error.response.data.message).to.equal("User not found.");
        } else {
          expect.fail(`Unexpected error: ${error.message}`);
        }
      }
    });
  });
});
