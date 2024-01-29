const NodeCache = require('node-cache');

// Create a NodeCache instance
const tokenBlacklist = new NodeCache();

// Function to add a token to the blacklist with a specified TTL
const addToBlacklist = (token) => {
  tokenBlacklist.set(token, true, 3600); // 3600 seconds (1 hour)
};

// Function to check if a token is in the blacklist
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

module.exports = {
  addToBlacklist,
  isTokenBlacklisted,
};