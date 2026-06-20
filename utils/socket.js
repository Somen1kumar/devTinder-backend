const socket = require('socket.io');
const {chatModel} = require('../models/chatModel');
const connectionModel = require('../models/connectionRequest');

const Socket = (server) => {

    const io = socket(server, {
        cors: {
        origin: 'http://localhost:5173'
        },
    });
    io.on('connection', client => {
  client.on('joinChat', ({targetObj}) => {
    console.log("targetParams", targetObj);
    const roomId = targetObj.split("_").sort().join("_");
    console.log(roomId);
    client.join(roomId);



  });
  client.on('sendMessage', async ({newMessage, messages}) => { 
    const {targetObj, userInfo, text , id, fromUserId} = newMessage;
    const splitRoomId = targetObj.split("_");
    const roomId = targetObj.split("_").sort().join("_");
    console.log(newMessage);
    let findConnection = await connectionModel.findOne({
        $and: [
            {status: "accepted"},
            {$or: [
                {fromUserId: splitRoomId[0], toUserId: splitRoomId[1]},
                {toUserId: splitRoomId[0], fromUserId: splitRoomId[1]}
            ]}
        ]
    });
    console.log("check",findConnection);
    if(findConnection) {
        let findRoom = await chatModel.findOne({
            participation: { $all: [splitRoomId[0], splitRoomId[1] ] }
        });
        if(!findRoom) {
            findRoom =  await chatModel({
                participation: [splitRoomId[0], splitRoomId[1] ],
                chatMessage: []
            });
        }
        findRoom.chatMessage.push({
            message: text,
            fromUserId: fromUserId
        });
        console.log("chatModel.chatMessage", findRoom);
        await findRoom.save();
        console.log(newMessage);
        io.to(roomId).emit("updatedMessage", {userInfo, text, id, fromUserId, messages} );

    }

  });
  client.on('disconnect', () => { /* … */ });
});

}
module.exports = Socket;