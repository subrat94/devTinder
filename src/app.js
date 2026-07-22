const express=require("express")
const app=express()
const connectDB=require("./config/database")
const User=require("./models/user")


// const { adminAuth, userAuth }=require("./middleware/Auth")
const PORT=3000
//middle ware for reading json
app.use(express.json())

//create api
app.post("/signup",async (req,res)=>{
    // console.log(req.body);


    const user=new User(req.body)
    try{
    await user.save()
    res.status(201).json({
        message: "User created successfully",
        user
    });
}catch(err){
    res.status(400).json({
        message:"bad request"
    })

}

     
})

connectDB().then(() => {
    console.log("db connected successfully for now");
    app.listen(PORT, () => {
        console.log("server running successfully", PORT);

    })

}).catch((err) => {
    console.error("db failed")

})































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

