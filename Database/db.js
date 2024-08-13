const mongoose = require('mongoose');
require("dotenv").config;

const connectMongodb = async() => {
    try{
        const URI = process.env.MONGO_URI
        console.log(`Connecting to MongoDB  at ${URI}`);
        await mongoose.connect(URI)
        console.log('Connected to MongoDB');
    }catch (err){
        console.log('Error Connecting to MongoDB',err);
    }
}

module.exports = { connectMongodb }