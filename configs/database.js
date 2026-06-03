

const mongoose = require("mongoose");
require('dotenv').config();


const connectToDB = async() => {
    mongoose.connect(process.env.DB_CONNECTION_URL);
}

module.exports= {
    connectToDB
}