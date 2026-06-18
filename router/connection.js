


const express = require("express");
const { JWTAuthentication } = require("../utils/middleware");
const { validateStatus, validateStatusRequest } = require("../utils/connectionValidation");
const connectionModel = require("../models/connectionRequest");
const { User } = require("../models/user");

const routeApp = express.Router();
const SECURE_DETAILS = ["firstName", "lastName","age","gender","photoUrl", "description"];


//sent connection to specific user
routeApp.post("/sent/:status/:matchId", JWTAuthentication, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const matchingID = req.params.matchId;
        const status = req.params.status;
        const acceptedStatus = validateStatus(status);
        if(!acceptedStatus) {
            return res.status(400).json({
                errorCode: 3223,
                message: `Invalid status type ${status}`
            });
        };
        if(loggedInUser._id.equals(matchingID)) {
            throw new Error("Cannot Sent Connection Request to Yourself");
        }

        const isExistingConnection = await connectionModel.findOne(
            {
                $or: [{fromUserId: loggedInUser._id, toUserId: matchingID},
                 {toUserId: loggedInUser._id, fromUserId: matchingID}]
            }
        );
        if(isExistingConnection) {
            return res.status(400).json({
                errorCode: 3223,
                message: `Connection already Exist with the User ${loggedInUser.firstName}`
            });
        }

        const sendData = await connectionModel({
            fromUserId: loggedInUser._id,
            toUserId: matchingID,
            status: status
        });
        sendData.save();

        res.status(200).json({
            message: `Connection of ${status} is send Successfully`,
        });
    } catch (error) {
        res.status(400).json({
            errorCode:2003,
            message: error.message
        })
        
    }
});


routeApp.get("/review", JWTAuthentication, async (req,res) => {

    const currentUser = req.user;
    try {
        const getInvitedUser = await connectionModel.find({
        $and: [
            {toUserId: currentUser._id},
            {status: "interested"}
        ]
    }).populate("fromUserId", SECURE_DETAILS ).select("_id, fromUserId, toUserId");

    res.status(200).send({
        newConnectionRequest: getInvitedUser
    });
 
        
    } catch (error) {
       res.status(400).json({
            errorCode: 202,
            message: error.message
        }); 
    }

})

//review connection request and update the interested one
routeApp.post("/review/:status/:connectionId", JWTAuthentication, async (req,res) => {
    try {
        const currentLoggedInUser = req.user;
        const status = req.params.status;
        const connectionId = req.params.connectionId;
        const isValidStatus = validateStatusRequest(status);
        if(!isValidStatus) {
            return res.status(404).json({
                errorCode: 404,
                message: "Invalid Status Code Found "
            });
        }
        const data = await connectionModel.findOne({
            $and: [
                {fromUserId: connectionId},
                {toUserId: currentLoggedInUser._id.toString()},
                {status: "interested"}
            ]
        });
        console.log("fromUserId", connectionId, "ToUserId", currentLoggedInUser._id);
        console.log(data);

        data.status = status;
        const saveData = await data.save();


        if(!saveData) {
            return res.status(404).json({
                errorCode: 404,
                message: "Invalid Connection Request.Please check the Connection Id "
            });
        };

        res.status(200).json({
            message: "Connection is "+ status,
            data: currentLoggedInUser
        });
        
    } catch (error) {

        res.status(400).json({
            errorCode: 202,
            message: error.message
        });
        
    }






})








module.exports = routeApp;