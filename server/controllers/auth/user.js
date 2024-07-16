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
        console.log(err);
        res.status(403).json({ error: err });
      }
}