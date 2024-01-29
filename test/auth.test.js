const chai = require('chai');
const axios = require('axios');
require('dotenv').config();
const expect = chai.expect;

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8082"

// Declare a variable to store the authTokenPromise
const authTokenPromise = (async () => {
  // Perform the login request to obtain the authToken
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
    email: 'raj@gmail.com',
    password: 'raj@gmail.com',
  });

  // Return the authToken
  return response.data.data;
})();

// Export the authTokenPromise
module.exports = {
  authTokenPromise,
};
