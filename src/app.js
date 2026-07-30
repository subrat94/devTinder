const express = require("express");
const app = express();
const connectDB = require("./config/database");
const { validateSignUp } = require("./utils/validation");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { Error } = require("mongoose");
const { userAuth } = require("./middleware/Auth")

// const { adminAuth, userAuth }=require("./middleware/Auth")
const PORT = 3000;
//middle ware for reading json
app.use(express.json());
app.use(cookieparser());

//create api (create data in database)
app.post("/signup", async (req, res) => {
    // console.log(req.body);
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

//login api
app.post("/login", async (req, res) => {
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
        res.status(400).send("error " + err.message);
    }
});

//profile api

app.get("/profile", userAuth, async (req, res) => {
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

//find a user by their email

app.get("/userByMail", async (req, res) => {
    const userMail = req.body.email;
    try {
        const user = await User.find({ email: userMail });
        if (user.length === 0) {
            res.status(400).send("no record found");
        } else {
            res.status(200).send(user);
        }
    } catch (err) {
        res.status(400).json({ message: "something went wrong" });
    }
});
//get all data from database ()
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        res.status(401).send("there is no record");
    }
});

//delete a user by id
app.delete("/deleteById", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.status(200).send("user deleted successfully");
    } catch (err) {
        res.status(400).send("something went wrong");
    }
});

//api for update data by id
app.patch("/updateUser/:userId", async (req, res) => {
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

connectDB()
    .then(() => {
        console.log("db connected successfully for now");
        app.listen(PORT, () => {
            console.log("server running successfully", PORT);
        });
    })
    .catch((err) => {
        console.error("db failed");
    });

//using middleware in this route
// app.use("/admin", adminAuth)

// //testing
// app.get("/admin/getAllData",(req,res)=>{
// res.send("get All data")

// })

// app.get("/user/:userId/:name", userAuth,(req,res)=>{
//     console.log(req.params);

//     res.send("testing")

// })
// app.post("/users",(req,res)=>{
//     res.send("data successfully send to database")

// })

// app.use('/hello',(req,res)=>{
//     res.send("hello hello i am here")
// })

// //Error Handling

// app.get("/getErrorData",(req,res)=>{
//     throw new Error("wrong")
//     res.send("user error data")

// })

// app.get("/getAllData",(req,res)=>{
//     try{
//         console.log("checking try");

//         res.send("sending all data")

//     }catch (err){
//         res.send(err)

//     }
// })

// //error handling the error route
// app.use("/", (err, req, res, next) => {
//     if (err) {
//         res.status(500).send("something went wrong")
//     }
// })
