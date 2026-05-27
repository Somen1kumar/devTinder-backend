



const mongoose = require("mongoose");

const connectToDB = async() => {
    mongoose.connect("mongodb+srv://somen:somen@meetup.e6ec10h.mongodb.net/devTinder");
}

module.exports= {
    connectToDB
}