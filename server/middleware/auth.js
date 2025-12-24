const jwt = require("jsonwebtoken");
const User = require("../database/models/user");

const Authenticate = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        error: "Authorization header missing",
        msg: "Please provide an access token"
      });
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ 
        error: "Invalid authorization format",
        msg: "Authorization header must be in format: Bearer <token>"
      });
    }

    const token = parts[1];
    if (!token) {
      return res.status(401).json({ 
        error: "Token missing",
        msg: "Access token is required"
      });
    }

    // Verify token
    let verified;
    try {
      verified = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: "Token expired",
          msg: "Access token has expired. Please refresh your token.",
          code: "TOKEN_EXPIRED"
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: "Invalid token",
          msg: "Access token is invalid",
          code: "INVALID_TOKEN"
        });
      } else {
        throw err;
      }
    }

    // Find user
    const user = await User.findOne({ _id: verified._id });
    if (!user) {
      return res.status(401).json({ 
        error: "User not found",
        msg: "User associated with token no longer exists"
      });
    }

    // Attach user info to request
    const { email, _id, username } = user;
    req.user = { email, _id, username };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ 
      error: "Authentication error",
      msg: "An error occurred during authentication"
    });
  }
};

module.exports = Authenticate;