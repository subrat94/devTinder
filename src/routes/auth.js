const express = require("express")
const authRouter = express.Router()
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// authRouter.use(express.json());

authRouter.post("/signup", async (req, res) => {
    console.log(req.body);
    //for every register api there some step you have to follow every time
    try {
        //validation of data
        validateSignUp(req);
        const { firstName, lastName, email, password } = req.body;
        // encrept the password
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log("hasing passwod", passwordHash);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        await user.save();
        res.status(201).json({
            message: "User created successfully",
            // user
        });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        //check email id exist or not
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credential");
        }
        //comparing password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            //create a jwt token
            const token = await user.getJWT()
            console.log(token);

            //add the token to cookies and send the response back to the user
            res.cookie("token", token);
            res.status(200).send("successfully loged in");
        } else {
            res.status(400).send("password is not correct");
        }
    } catch (err) {
        res.status(400).send("error is " + err.message);
    }
});

//logout api
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null), {
        expires: new Date(Date.now())
    }
    res.send("logout successfully!!")
})
authRouter.patch("/updateUser/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOW_UPDATE = [
            "userId",
            "password",
            "age",
            "photourl",
            "about",
            "skills",
        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOW_UPDATE.includes(k),
        );
        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }
        await User.findByIdAndUpdate({ _id: userId }, data);
        res.status(200).send("successfully update");
    } catch (err) {
        res.status(400).send("something went wrong");
    }
});

module.exports = authRouter