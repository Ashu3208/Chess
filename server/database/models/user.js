const mongoose = require("mongoose")
const jwt= require("jsonwebtoken")
require('dotenv').config()

const UserSchema = mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    passwordResetTokenHash: {
        type: String,
        default: null
    },
    passwordResetTokenExpiresAt: {
        type: Date,
        default: null
    },
    refreshTokens: [{
        type: String,
        default: []
    }]
}, {
    timestamps: true
})

// Generate Access Token (short-lived, 15 minutes)
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, username: this.username },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Access token expires in 15 minutes
    );
};

// Generate Refresh Token (long-lived, 7 days)
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
        { expiresIn: '7d' } // Refresh token expires in 7 days
    );
};

// Add refresh token to user's token list
UserSchema.methods.addRefreshToken = async function (refreshToken) {
    this.refreshTokens.push(refreshToken);
    // Keep only last 5 refresh tokens per user (security measure)
    if (this.refreshTokens.length > 5) {
        this.refreshTokens = this.refreshTokens.slice(-5);
    }
    await this.save();
    return this;
};

// Remove refresh token (for logout)
UserSchema.methods.removeRefreshToken = async function (refreshToken) {
    this.refreshTokens = this.refreshTokens.filter(token => token !== refreshToken);
    await this.save();
    return this;
};

// Clear all refresh tokens (for security - password change, etc.)
UserSchema.methods.clearAllRefreshTokens = async function () {
    this.refreshTokens = [];
    await this.save();
    return this;
};

// Legacy method for backward compatibility (generates access token)
UserSchema.methods.generateAuthToken = async function () {
    try {
        return this.generateAccessToken();
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);