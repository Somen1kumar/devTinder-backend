


const express = require("express");
const { JWTAuthentication } = require("../utils/middleware");
const connectionModel = require("../models/connectionRequest");
const { User } = require("../models/user");

const userRouter = express.Router();

const SECURE_DETAILS = ["firstName", "lastName","age","gender","skills"];
userRouter.get("/request/received", JWTAuthentication, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const getAllReq = await connectionModel.find({
            $and:[
                {toUserId: loggedInUser._id},
                {status: "interested"}
            ]
        }).populate("fromUserId", SECURE_DETAILS).populate("toUserId", ["firstName","lastName"]);

        res.status(200).json({
            message: "allEnteries",
            data: getAllReq
        });
        
    } catch (error) {
        res.status(404).json({
            errorCode: 404,
            message: error.message
        })
        
    }

});

userRouter.get("/user_connections", JWTAuthentication, async (req,res) => {
    try {

        const currentUser = req.user;
        const allConnections = await connectionModel.find({
            $and: [
                {
                    status: "accepted",
                },
                {
                    $or: [
                        {fromUserId: currentUser._id},
                        {toUserId: currentUser._id}
                    ]
                }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "email"]).populate("toUserId", ["firstName","lastName","email"]);

        const yourConnection = allConnections.map((item) => {
            if(item.fromUserId._id.toString() === currentUser._id.toString()) {
                return item.toUserId;
            }
            return item.fromUserId;
        });

        res.status(200).json({
            data: yourConnection
        })
        
    } catch (error) {

        res.status(404).json({
            errorCode: 4003,
            message:error.message
        });
    }
});

userRouter.get("/feed",JWTAuthentication, async (req,res) => {

    try {

        const currentLoggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 2;

        if (limit >30) {
            limit = 30;
        }

        const skip = (page-1)*limit;
        /**
         *  fetch all the data except curr user
         * filter all the user which has no connect type 
         * 
         */
        const findAllConnectionRequest = await connectionModel.find({
            $or:[
                {fromUserId: currentLoggedInUser._id},
                {toUserId: currentLoggedInUser._id}
            ]
        });
        const hideUser = new Set();
        hideUser.add(currentLoggedInUser._id.toString());
        findAllConnectionRequest.forEach(item => {
            hideUser.add(item.fromUserId.toString());
            hideUser.add(item.toUserId.toString());
        });
        const hideUserArr = Array.from(hideUser);
        console.log(hideUser);
        const findAllFeed = await User.find({
            $or:[
                {_id: {$nin: Array.from(hideUser)}}
            ]
        }).select("firstName lastName age photoUrl description skills email updatedAt").skip(skip).limit(limit);

        res.json({user: findAllFeed})
        
    } catch (error) {
        res.status(404).json({
            errorCode: 404,
            message: error.message
        });
    }
});

userRouter.get("/feed2", JWTAuthentication, async (req,res) => {

    try {
        
        const currentUser = req.user;

        const findAllConnectionRequest = await connectionModel.find({
            $or:[
                {fromUserId : currentUser._id},
                {toUserId: currentUser._id}
            ]
        });

        const findAndRemoveDoublicateIds = new Set();
        findAllConnectionRequest.forEach(item => {
            findAndRemoveDoublicateIds.add(item.fromUserId.toString());
            findAndRemoveDoublicateIds.add(item.toUserId.toString());
        });
        console.log("findAndRemoveDoublicateIds",findAndRemoveDoublicateIds)

        const findAllFeedForCurrentUser = await User.find({
            $and:[
                {_id: {$nin : Array.from(findAndRemoveDoublicateIds)}}
            ]
        }).select("_id firstName lastName email age gender skills updatedAt, photoUrl,description,");

        res.status(200).json({
            connectedUser: findAllFeedForCurrentUser
        });




    } catch (error) {
        res.status(404).json({
            errorCode: 404,
            message: error.message
        });
        
    }


})














module.exports = userRouter;