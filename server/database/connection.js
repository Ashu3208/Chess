require('dotenv').config()
const mongoose = require('mongoose');

const connectDatabase = async () => {
    try{
        const connection = await mongoose.connect(process.env.DB_URI);
        console.log("Successfully connected to the database.");
    } catch (err){
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDatabase;