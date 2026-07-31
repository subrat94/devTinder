const express = require("express")

const profileRouter = express.Router()
const User = require("../models/user");
const { userAuth } = require("../middleware/Auth")


profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            throw new Error("user not found")
        }
        res.send(user)

        // console.log("jwt token is", isTokenValid);

        // res.send("checking cookies");
        // console.log(cookies);
    }
    catch (err) {
        res.send("ERROR:", err.message)
    }
});
module.exports = profileRouter