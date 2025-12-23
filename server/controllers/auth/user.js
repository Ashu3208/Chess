const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

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
          const token = await newUser.generateAuthToken();
          res.status(201).json({username,email,token});
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
        console.log(req.body)
        if (!email || !password) {
          return res.status(400).json({ msg: "Invalid data" });
        }
    
        const user = await User.findOne({ email: email });
        console.log(user);
        if (user) {
          const match = await bcrypt.compare(password, user.password);
            
          const token = await user.generateAuthToken();
          console.log(token);
            
          if (!match) {
            res.status(410).json({ msg: "Invalid username or password" });
          } else {
            res.status(200).send({ msg: "Success!", token });
          }
        } else {
          res.status(401).json({ msg: "Invalid username or password" });
        }
      } catch (err) {
        res.status(403).json({ error: err });
      }
}

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