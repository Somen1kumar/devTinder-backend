




const express =  require("express");
const {
  validate_SignUp_User,
  validate_Login_User,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");


const authRoute = express.Router();

authRoute.post("/signup", async (req, res) => {
  try {
    const obj = req.body;
    //Validate User Input
    validate_SignUp_User(req);
    //Encrypt the Password of the User
    bcrypt.hash(obj.password, 10, async function (err, hash) {
      // Store hash in your password DB.
      try {
        const { password, ...rest } = obj;
        const newObj = {
          ...rest,
          password: hash,
        };
        console.log("newObj", newObj);
        const saveUser = new User(newObj);
        await saveUser.validate();
        await saveUser.save();
        res.json({
          data: {
            firstName: obj.firstName,
            lastName: obj.lastName,
            email: obj.email,
            age: obj.age,
            gender: obj.gender,
            skills: obj.skills
          }
        });
      } catch (error) {
        res.status(500).json({
        errorCode:404,
        message: "Oops Something went wrong" + error.message});
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Oops Something went wrong" + error.message);
  }
});

authRoute.post("/login", async (req, res) => {
  try {
    validate_Login_User(req);
    const userEmail = req.body?.email;
    const password = req.body?.password;


    const currentUser = await User.findOne({ email: userEmail });
    if (!currentUser) {
      res.status(404).send("Invalid Credentials");
    }

    bcrypt.compare(password, currentUser.password, async function (err, result) {
      if (result) {
        //TODO Create a JWT of userId and push it to cookie
        //const JWT_TOKEN = jwt.sign({id: currentUser._id}, PRIVATE_KEY, {expiresIn: "1d"});
        const JWT_TOKEN = await currentUser.createJWTToken();
        res.cookie("token",JWT_TOKEN, {
          expires: new Date(Date.now() + 86400000)
        });
        const newUser = {
            id: currentUser._id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            age: currentUser.age,
            gender: currentUser.gender,
            skills: currentUser.skills
          }
        res.status(200).json({ message: "login SuccessFully", data: newUser });
      } else {
        res.status(404).json({
          errorCode: 404,
          errorMessage:"Invalid Credentials"
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      errorCode:404,
      message: "Oops Something went wrong" + error.message});
  }
});

authRoute.get("/logout", async (req, res) => {

  try {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    }).json({
        status:200,
        message: "loggedOut Successfuly"
    });
  } catch (error) {
    res.status(500).json({
      errorCode:404,
      message: "Oops Something went wrong" + error.message
    });
  }

})



module.exports = authRoute;