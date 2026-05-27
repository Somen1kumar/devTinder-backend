


// const adminExports = (req,res,next) => {
//     const xya= 'xyz';
//     if(xya === 'xyz') {
//         next();
//     } else {
//         res.status(404).send("Not found");

//     }
// };

// const userExports = (req,res,next) => {
//     const xya= 'xyz';
//     if(xya === 'xyz') {
//         next();
//     } else {
//         res.status(404).send("Not found");

//     }
// };
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const validator = require("validator")
const PRIVATE_KEY = "CARNIVALPOCUK12345ADOBE";


const JWTAuthentication = async (req, res, next) => {
    try {
        
        const token = req.cookies.token;
        console.log("token", token);
        if (!token) {
            throw new Error("Invalid Token");
        }
        const jwtId = await jwt.verify(token, PRIVATE_KEY);
        const currentUser = await User.findById(jwtId.id);
        if (!currentUser) {
            throw new Error("Invalid User");
        }
        req.user = currentUser;
        next();

    } catch (error) {
        res.json({
        errorCode: 404,
        errorMessage: "Oops Something went wrong with JWT" + error.message
        });
    }
}

const loggedInUserValidation = async (req, res, next ) => {

    const acceptedUserValidation = ["age", "gender", "skills", "lastName"];
    const userObj = req.body;

    const isValid = Object.keys(userObj).every(field => acceptedUserValidation.includes(field));

    if (isValid) {
        next();
    }
    else {
        res.status(200).json({
            errorCode:5003,
            message:"invalid Data found in req body"
        });
    }

}
const loggedInUserPasswordValidation = async (req, res, next ) => {

    const acceptedUserValidation = ["password"];
    const userObj = req.body;

    const isValidPayload = Object.keys(userObj).some(field => acceptedUserValidation.includes(field));

    const isValidPassword = isValidPayload ? validator.isStrongPassword(userObj.password) : false;

    

    if (isValidPayload) {
        next();
    }
    else {
        res.status(200).json({
            errorCode:5003,
            message:"invalid Password found.Retry the password again with special cases"
        });
    }

}

module.exports = {
JWTAuthentication,
loggedInUserValidation,
loggedInUserPasswordValidation
}