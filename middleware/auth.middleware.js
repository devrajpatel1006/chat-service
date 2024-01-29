const jwt = require("jsonwebtoken");
const {
  addToBlacklist,
  isTokenBlacklisted,
} = require("../config/tokenBlacklist");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  const protectedRoutes = ["/api/users/add", "/api/users/edit", "/api/users"];

  // Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({
        status: false,
        message: "Unauthorized - No token provided",
        data: [],
      });
  }

  try {
    // Check if the token is in the blacklist
    if (isTokenBlacklisted(token)) {
      return res
        .status(401)
        .json({
          status: false,
          message: "Unauthorized - Token is blacklisted",
          data: [],
        });
    }
    // Verify the token
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    // Check if the current route partially matches any protected route
    if (protectedRoutes.some((route) => req.originalUrl.includes(route))) {
      // Check if the user has the necessary role
      if (decoded.user.role === "admin") {
        // Attach the user information to the request object
        req.user = decoded.user;
        next();
      } else {
        return res.status(403).json({
          status: false,
          message:
            "Forbidden - You do not have the permission to access this route",
          data: []
        });
      }
    } else {
      // Attach the user information to the request object for non-protected routes
      req.user = decoded.user;
      next();
    }
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ status:false,message: "Unauthorized - Invalid token", data: []});
  }
};

module.exports = authMiddleware;
