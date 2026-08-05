const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieparser = require("cookie-parser");

const { Error } = require("mongoose");
app.use(express.json());
app.use(cookieparser());
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


// const { adminAuth, userAuth }=require("./middleware/Auth")
const PORT = 3000;
//middle ware for reading json

//create api (create data in database)


//login api


//profile api


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
