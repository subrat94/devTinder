const mongoose = require("mongoose")
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  //reference to the user collection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{value} is incorrect status type`
        }
    }

}, {
    timestamps: true
})

//pre function
// connectionRequestSchema.pre("save" ,function(next){
//     const connectionRequest=this;
//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error("can not send connection request to yourself!!")
//     }
//     next()

// })
connectionRequestSchema.pre("save", function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
    }
});
// module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema)
const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequest