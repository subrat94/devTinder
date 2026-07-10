const express=require("express")
const app=express()
const PORT=3000

app.use("/",(req,res)=>{
    res.send("hello server")
})

app.listen(PORT,()=>{
    console.log("server running successfully");
    
})