const jwt = require("jsonwebtoken");
const User = require("../database/models/user");

const Authenticate = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const verified =  jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({
      _id: verified._id,
    });
    if (!user) {
      throw new Error("Invalid user or token");
    }
    const {email, _id, username} = user
    req.user = {email,_id,username};
    next();
  } catch (err) {
    res.status(401).send("Didn't find token!");
    console.log(err);
  }
};

module.exports = Authenticate;