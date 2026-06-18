

const { Schema, Types, Mongoose, Model, model} = require("mongoose");

const ChatSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})
const RoomSchema = new Schema({
    participation: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,

    }],
    chatMessage: [
        ChatSchema
    ]
});

const chatModel = model("chat", RoomSchema);

module.exports = {
    chatModel
};

