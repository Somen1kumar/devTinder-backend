const express = require("express");

const profileReq = express.Router();
const {
  JWTAuthentication,
  loggedInUserValidation,
  loggedInUserPasswordValidation,
} = require("../utils/middleware");

const bcrypt = require("bcrypt");

profileReq.get("/userData", JWTAuthentication, async (req, res) => {
  try {
    //WithOut MiddleWare -----------------------------------------------
    // const token = req.cookies?.token;
    // if (!token) {
    //   throw new Error(" JWT is missing . Please Login Again");
    // }
    // var decoded = await jwt.verify(token, PRIVATE_KEY);
    // console.log("reqCookie", decoded);
    // const currentProfile = await User.findById(decoded.id);
    // if(!currentProfile) {
    //   throw new Error("Profile doesnot Exist");
    // }
    //---------------------------------------
    console.log("req", req.user);
    const { firstName, lastName, email, age, gender, skills, _id, description,photoUrl } = req.user;
    res.status(200).json({
      firstName,
      lastName,
      email,
      age,
      gender,
      skills,
      photoUrl,
      description,
      id:_id
    });
  } catch (error) {
    res.status(404).json({
      errorCode: 404,
      errorMessage: "Oops Something went wrong with JWT" + error.message
    });
  }
});

profileReq.patch(
  "/updateUser",
  loggedInUserValidation,
  JWTAuthentication,
  async (req, res) => {
    try {
      const currentUser = req.user;
      const updatedUser = req.body;

      Object.keys(updatedUser).every(
        (key) => (currentUser[key] = updatedUser[key]),
      );
      await currentUser.save();
      console.log(currentUser);

      res.status(201).json({
        error: 0,
        message: "Updated data",
      });
    } catch (error) {
      res
        .status(500)
        .send("Oops Something went wrong with JWT" + error.message);
    }
  },
);

profileReq.patch(
  "/changePassword",
  loggedInUserPasswordValidation,
  JWTAuthentication,
  async (req, res) => {
    try {
        const bodyPassword = req.body;
        const systemPassword = req.user;

        const newHashPassword = await bcrypt.hash(
                bodyPassword.password,
                10
              );
      bcrypt.compare(
        bodyPassword.oldPassword,
        systemPassword.password,
        async function (err, same) {
            console.log("same", same);
          if (same) {
            try {
                systemPassword.password = newHashPassword;
                systemPassword.save();
              res.status(200).json({
                error: 0,
                message: "Password Change Succesfully",
                email: systemPassword.email,
              });
            } catch (error) {
              res
                .status(500)
                .send(
                  "Oops Something went wrong with Password Change " +
                    error.message,
                );
            }
          }
        },
      );
    } catch (error) {
      res
        .status(500)
        .send("Oops Something went wrong with JWT" + error.message);
    }
  },
);

module.exports = profileReq;
