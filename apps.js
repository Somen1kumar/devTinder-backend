const express = require("express");
const http = require("http");
const cookieParser = require('cookie-parser')
const { connectToDB } = require("./configs/database");
const { User } = require("./models/user");
const authUser = require("./router/auth");
const userProfile = require("./router/profile");
const userConnection = require("./router/connection");
const userDetails = require("./router/user");
const SocketIO = require("./utils/socket")
const cors = require('cors');
const chatRoute = require("./router/chat");
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));
const server = http.createServer(app);
SocketIO(server);
// for parsing the cookie we need cookie parser so that we can read from req of api
app.use(cookieParser());
app.use("/auth",authUser);
app.use("/profile", userProfile);
app.use("/request", userConnection);
app.use("/user", userDetails);
app.use("/chat", chatRoute);

connectToDB()
  .then(() => {
    console.log("Database connected");
    server.listen(3000, () => {
      console.log("Connected to the Port 3000");
    });
  })
  .catch((e) => {
    console.error(e);
});



// app.post("/signup", async (req, res) => {
//   try {
//     //  const obj = {
//     //     firstName: "Kingo",
//     //     lastName: "NEmasis",
//     //     email: "kingoss2@gmail.com",
//     //     password: "passwsdord12",
//     //     age: 222,
//     //     gender: "Female"
//     //      skills: []
//     // };
//     const obj = req.body;
//     //Validate User Input
//     validate_SignUp_User(req);
//     //Encrypt the Password of the User
//     bcrypt.hash(obj.password, 10, async function (err, hash) {
//       // Store hash in your password DB.
//       try {
//         const { password, ...rest } = obj;
//         const newObj = {
//           ...rest,
//           password: hash,
//         };
//         console.log("newObj", newObj);
//         const saveUser = new User(newObj);
//         await saveUser.validate();
//         await saveUser.save();
//         res.send("Data saved Successfully");
//       } catch (error) {
//         res.status(500).send("Oops Something went wrong" + error.message);
//       }
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).send("Oops Something went wrong" + error.message);
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     validate_Login_User(req);
//     const userEmail = req.body?.email;
//     const password = req.body?.password;


//     const currentUser = await User.findOne({ email: userEmail });
//     if (!currentUser) {
//       res.status(404).send("Invalid Credentials");
//     }

//     bcrypt.compare(password, currentUser.password, async function (err, result) {
//       if (result) {
//         //TODO Create a JWT of userId and push it to cookie
//         //const JWT_TOKEN = jwt.sign({id: currentUser._id}, PRIVATE_KEY, {expiresIn: "1d"});
//         const JWT_TOKEN = await currentUser.createJWTToken();
//         res.cookie("token",JWT_TOKEN, {
//           expires: new Date(Date.now() + 86400000)
//         });
//         res.status(200).send({ email: userEmail, message: "login SuccessFully" });
//       } else {
//         res.status(404).send("Invalid Credentials");
//       }
//     });
//   } catch (error) {
//     res.status(500).send("Oops Something went wrong" + error.message);
//   }
// });

// app.get("/profile", JWTAuthentication, async (req,res) => {

//   try {
//     //WithOut MiddleWare -----------------------------------------------
//     // const token = req.cookies?.token;
//     // if (!token) {
//     //   throw new Error(" JWT is missing . Please Login Again");
//     // }
//     // var decoded = await jwt.verify(token, PRIVATE_KEY);
//     // console.log("reqCookie", decoded);
//     // const currentProfile = await User.findById(decoded.id);
//     // if(!currentProfile) {
//     //   throw new Error("Profile doesnot Exist");
//     // }
//     //---------------------------------------
//     console.log("req", req.user)
//     const {firstName, lastName, email, age, gender, skills} = req.user;
//     res.status(200).send({
//       firstName,lastName,email, age, gender, skills
//     });
//   } catch (error) {
//     res.status(500).send("Oops Something went wrong with JWT" + error.message);

//   }

// })

app.get("/userInfo", async (req, res) => {
  try {
    const userInfo = await User.find().sort({ age: -1 });
    console.log("userInfo", userInfo);
    if (userInfo.length <= 0) {
      res.status(404).send("No Details found");
    }
    res.status(200).send(userInfo);
  } catch (error) {
    res.status(500).send("Something Went wrong");
  }
});

app.delete("/delete", async (req, res) => {
  const userEmail = req.body.userEmail;
  console.log("userEmail", userEmail);
  try {
    const userDelete = await User.deleteMany({ email: userEmail });
    console.log("userDelete", userDelete);
    if (userDelete) {
      res.status(200).send("data deleted Successfully");
    } else {
      res.status(200).send("User Not found");
    }
  } catch (error) {
    res.status(404).send("Oops Something went wrong");
  }
});

app.put("/update", async (req, res) => {
  const userEmail = req.body.userEmail;
  const userData = req.body.userData;

  // console.log("lastName", userData.lastName)

  try {
    if (!userData.lastName) {
      console.log("userEmail", userEmail);
      const userUpdate = await User.find({ email: userEmail }).updateOne({
        gender: userData.gender,
      });
      console.log("userUpdate", userUpdate);
      if (userUpdate.modifiedCount > 0) {
        res.status(200).send("data updated Successfully");
      } else {
        res.status(404).send("User Not Updated");
      }
    } else {
      const userUpdate = await User.find({ email: userEmail }).updateMany(
        {
          firstName: userData.firstName,
        },
        {
          lastName: userData.lastName,
        },
        {
          email: userData.email,
        },
        {
          password: userData.password,
        },
        {
          age: userData.age,
        },
        {
          gender: userData.gender,
        },
        { runValidators: true },
      );
      if (userUpdate && userUpdate.modifiedCount > 0) {
        res.status(200).send("data updated Successfully");
      } else {
        res.status(404).send("User Not Updated");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Oops Something went wrong" + error.message);
  }
});

app.patch("/lightUpdate/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userDetails = req.body.userData;
  const ALLOWED_UPDATE = ["skills", "age", "password", "gender"];

  console.log("userId", userId);
  try {
    const checkValidate = Object.keys(userDetails).every((r) =>
      ALLOWED_UPDATE.includes(r),
    );
    console.log("checkValidate1", checkValidate);
    if (!checkValidate) {
      throw new Error("unauthorised Data found in Payload");
    }
    console.log("checkValidate", checkValidate);
    const update = await User.findByIdAndUpdate(userId, userDetails);
    if (update) {
      res.status(200).send({
        id: userId,
        message: "data Saved Successfully",
      });
    }
  } catch (error) {
    res.status(404).send("Error in updating data", error);
  }
});




/*
To check Express cookie expiration:- 
to read cookie use cookie parser :- https://www.npmjs.com/package/cookie-parser
to create JWT token , use Jsonwebtoken:- https://www.npmjs.com/package/jsonwebtoken


*/