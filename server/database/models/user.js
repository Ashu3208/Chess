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
    }
})
UserSchema.methods.generateAuthToken = async function () {
    try {
      let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
      await this.save();
      return token;
    } catch (err) {
      console.log(err);
    }
  };
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);