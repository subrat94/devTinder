const express = require("express")
const { userAuth } = require("../middleware/Auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")
const userRouter = express.Router()


userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"])
        res.status(200).json({ message: "connection fetched successfully", data: connectionRequest })

    }
    catch (err) {
        res.status(400).send("ERROR " + err.message)
    }
})
userRouter.get("/user/connection", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]

        }).populate("fromUserId", ["firstName", "lastName", "age", "gender"]).populate("toUserId", ["firstName", "lastName"])

        const data = connectionRequest.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.fromUserId
            }
            return row.fromUserId
        }) //give only from user data

        // res.status(200).json({ data: connectionRequest })
        res.status(200).json({ data })

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit

        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId  toUserId")
        const hideUserFromFeed = new Set()
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())

        });
        // console.log("hideUserFromFeed ", hideUserFromFeed);
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName skills about")
            .skip(skip).limit(limit) //pagination
        res.send(users)

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})



module.exports = userRouter