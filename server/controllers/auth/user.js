const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../database/models/user");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("../../utils/mailer")

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
          // Fire-and-forget welcome email (don't fail registration if SMTP fails)
          sendWelcomeEmail({ to: email, username }).catch((err) => {
            console.error("Welcome email failed:", err.message || err);
          });

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
        if (!user) {
          return res.status(401).json({ msg: "Invalid username or password" });
        }
        

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
    // Always return generic message to avoid user enumeration
    const generic = { msg: "If an account exists for this email, a reset link will be sent." };

    if (!user) return res.status(200).json(generic);

    // Create reset token (store only hash in DB)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const minutesValid = Number(process.env.PASSWORD_RESET_MINUTES || 60);
    user.passwordResetTokenHash = tokenHash;
    user.passwordResetTokenExpiresAt = new Date(Date.now() + minutesValid * 60 * 1000);
    await user.save();

    const clientBaseUrl =
      process.env.CLIENT_URL ||
      req.headers.origin ||
      "http://localhost:5173";

    const resetUrl = `${clientBaseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(
      rawToken
    )}&email=${encodeURIComponent(email)}`;

    // Fire-and-forget to keep response fast and avoid leaking SMTP issues
    sendPasswordResetEmail({
      to: email,
      username: user.username,
      resetUrl,
      minutesValid,
    }).catch((err) => {
      console.error("Password reset email failed:", err.message || err);
    });

    return res.status(200).json(generic);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ msg: "email, token and newPassword are required" });
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordResetTokenHash || !user.passwordResetTokenExpiresAt) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    if (user.passwordResetTokenExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.passwordResetTokenHash) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetTokenHash = null;
    user.passwordResetTokenExpiresAt = null;

    // Security: revoke all refresh tokens after password change
    user.refreshTokens = [];

    await user.save();

    return res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
};