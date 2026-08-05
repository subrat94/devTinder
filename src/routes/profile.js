const express = require("express")

const profileRouter = express.Router()
const User = require("../models/user");
const { validateEditProfile }=require("../utils/validation")
const { userAuth } = require("../middleware/Auth")


profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfile(req)){
            throw new Error("you can not allow to edit")
        }
        const loggedInUser = req.user
        // console.log(loggedInUser);
        Object.keys(req.body).forEach(field=>(loggedInUser[field]=req.body[field]))
        // console.log("dsts sfter edit",loggedInUser);
        res.send(`${loggedInUser.firstName} ,update successfully!!`)
        await loggedInUser.save()
    }
    
    catch(err){
        res.status(400).send("ERROR", err.message)
    }

})
module.exports = profileRouter