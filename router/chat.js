


const express = require("express");
const { JWTAuthentication } = require("../utils/middleware");
const { chatModel } = require("../models/chatModel");

const chatRoute= express.Router();
const SECURE_DETAILS = ["firstName", "lastName","age","gender","photoUrl", "description"];

chatRoute.get("/retrieveChat/:targetId", JWTAuthentication, async (req, res) => {
    try {
        const currentUser = req.user;
        const {_id, firstName} = currentUser;
        const targetUser = req.params.targetId;
        console.log("somen", targetUser)

        let findChat = await chatModel.findOne({
            participation: {$all: [_id, targetUser]}
        }).populate("chatMessage.fromUserId", SECURE_DETAILS);
        if(!findChat) {
            findChat = new chatModel({
                participation: [_id, targetUser],
                chatMessage: []
            });
        }
        res.status(200).json({
            data: findChat
        })
    } catch (error) {
        res.status(404).json({
            errorCode:404,
            errorMessage: "Oops Something went Wrong"
        })
        
    }
});

module.exports = chatRoute;