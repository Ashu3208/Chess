const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
const sendMail = require("../../utils/mailer")

exports.register = async(req,res) =>{
    try {
        const { username, email, password } = req.body;
    
        if (!email || !password || !username) {
          return res.status(400).json({ msg: "Invalid data" });
        }
    
        const userExists = await User.findOne({ email: email });
    
        if (userExists) {
          return res.status(202).json({ msg: "User Already Exists! " });
        }
        const hashedPassword= await bcrypt.hash(password,10)
        const newUser = new User({
          username,
          email,
          password:hashedPassword,
        });
    
        const registered = await newUser.save();
        if (registered) {
          // Generate both access and refresh tokens
          const accessToken = newUser.generateAccessToken();
          const refreshToken = newUser.generateRefreshToken();
          
          // Store refresh token in database
          await newUser.addRefreshToken(refreshToken);
          
          res.status(201).json({
            username,
            email,
            accessToken,
            refreshToken
          });
        } else {
          res.status(400).json({ error: "Registration Failed" });
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}


exports.login = async(req,res) =>{
    try {
        const {email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ msg: "Invalid data" });
        }
    
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(401).json({ msg: "Invalid username or password" });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ msg: "Invalid username or password" });
        }
        
        // Generate both access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        // Store refresh token in database
        await user.addRefreshToken(refreshToken);
        
        res.status(200).json({ 
          msg: "Success!", 
          accessToken,
          refreshToken
        });
      } catch (err) {
        res.status(500).json({ error: err.message || "Server error" });
      }
}

// Refresh token endpoint - generates new access token using refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ msg: "Refresh token is required" });
    }

    // Verify refresh token
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh';
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: "Invalid or expired refresh token" });
    }

    // Find user and verify refresh token is in their token list
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    if (!user.refreshTokens.includes(refreshToken)) {
      // Token was revoked (logout, security breach, etc.)
      return res.status(401).json({ msg: "Refresh token has been revoked" });
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Logout endpoint - revokes refresh token
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ msg: "Refresh token is required" });
    }

    // Verify and decode refresh token to get user ID
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh';
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      // Token might be expired, but we still want to clear it if it exists
      decoded = jwt.decode(refreshToken);
      if (!decoded) {
        return res.status(400).json({ msg: "Invalid refresh token" });
      }
    }

    const user = await User.findOne({ _id: decoded._id });
    if (user) {
      await user.removeRefreshToken(refreshToken);
    }

    res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Simple placeholder forgot-password handler (no email sending yet)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether user exists in a real app; here we just return generic message
      return res.status(200).json({ msg: "If an account exists for this email, a reset link will be sent." });
    }

    // Placeholder for generating and emailing a reset token.
    return res.status(200).json({ msg: "If an account exists for this email, a reset link will be sent." });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
}