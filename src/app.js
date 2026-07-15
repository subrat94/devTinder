const express=require("express")
const app=express()
const PORT=3000


app.get("/user",(req,res)=>{
    res.send({name:"subrat",city:"bbsr"})

})
app.post("/users",(req,res)=>{
    res.send("data successfully send to database")

})

app.use('/hello',(req,res)=>{
    res.send("hello hello i am here")
})


app.listen(PORT,()=>{
    console.log("server running successfully");
    
})