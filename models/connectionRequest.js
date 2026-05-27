const { Schema, Types, Mongoose, Model, model } = require("mongoose");



const connectionSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    status: {
        type: String,
        enum: ["interested", "ignored", "rejected","accepted"]
    }
},{
    timestamps: true
});

connectionSchema.index({fromUserId:1, toUserId:1});
connectionSchema.pre("save", function (next) {

    try {
        
        const currentUser = this;
        if(currentUser.fromUserId.equals(currentUser.toUserId)) {
            throw new Error("Cannot Sent Connection Request to Yourself");
        } else {
            next();
        }
    }
    catch (error) {
        console.error(error.message);
    }
});

const connectionModel = model("connectionType", connectionSchema);



module.exports = connectionModel;