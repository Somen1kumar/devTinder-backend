

const validator = require("validator");


const validate_SignUp_User = (req) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const photoUrl = req.body.photoUrl;
    const description = req.body.description;

    if(!firstName || !lastName || !email || !photoUrl || !description) {
        return new Error("Null Data is received");
    }
    if(!validator.isEmail(email)) {
        return new Error("Invalid Email Type Received");
    }
    if(!validator.isStrongPassword(password)) {
        return new Error("Password is not Strong Enough");
    }
}

const validate_Login_User = (req) => {

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return new Error("Null Data is received");
    }
    if(!validator.isEmail(email)) {
        return new Error("Invalid Email Type Received");
    }
    if(!validator.isStrongPassword(password)) {
        return new Error("Password is not Strong Enough");
    }
}


module.exports = {
    validate_SignUp_User,
    validate_Login_User
}