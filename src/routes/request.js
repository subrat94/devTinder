const express = require("express")
const requestRouter = express.Router()
const User = require("../models/user");
const { userAuth } = require("../middleware/Auth");
const ConnectionRequest = require("../models/connectionRequest");
// const User=require("../models/user")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "invalid status type  " + status
            })
        }
        //finding the to user
        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(404).json({ message: "user is not found" })
        }
        //finding is there any exsiting request
        const exsistConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }

            ]
        })
        if (exsistConnectionRequest) {
            return res.status(400).json({ message: "connection request is already exist" })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status

        })
        const data = await connectionRequest.save()
        res.status(200).json({
            message: "connection request sent successfully!",
            data
        })

    }
    catch (err) {
        return res.status(400).send("ERROR " + err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const status = req.params.status
        const requestId = req.params.requestId
        //validate the status
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "not a valid status " })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if (!connectionRequest) {
            return res.status(404).json({ message: "connection request is not found" })
        }
        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.status(200).json({ message: "connection request successfully!!", data })


        //login user should be to user to accept or reject the request
        //sending status shouls be interested
        //request id should be validate


    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }

})


module.exports = requestRouter