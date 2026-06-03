const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const { Schema, model } = mongoose;
const PRIVATE_KEY = "CARNIVALPOCUK12345ADOBE";

const schemaUser = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    },
    skills: {
      type: [String],
      default: ["Java", "SprintBoot", "JavaScript"],
    },
  },
  { timestamps: true },
);
schemaUser.path("gender").validate(function (value) {
  return ["male", "female", "other"].includes(value) ? true : false;
});

schemaUser.path("email").validate(function (value) {
  if (!validator.isEmail(value)) {
    return false;
  }
  return true;
});
schemaUser.methods.createJWTToken = async function () {
  const currentUser = this;
  const JWT_TOKEN = await jwt.sign({id: currentUser.id}, PRIVATE_KEY, {expiresIn: "1d"});

  return JWT_TOKEN;
}

const User = model("User", schemaUser);

module.exports = {
  User,
};
