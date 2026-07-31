 const jwt=require("jsonwebtoken") 
 const  User=require("../models/user")
//  app.use(express.json());
//  app.use(cookieparser());
// const adminAuth = (req, res, next) => {
//     console.log("checking auth middleware");

//     const token = "xyz";
//     const isAuthorised = token === "xyz"
//     if (!isAuthorised) {
//         res.status(401).json({
//             success: false,
//             message: "unAuthorised user"
//         })
//     } else {
//         next()
//     }

// }

// const userAuth=(req,res,next)=>{
//     console.log("user authentication checking");
    
//     const token="xyxy"
//     const isAuthoriseUser=token==="xyxy"
//     if(!isAuthoriseUser){
//         res.status(401).json({
//             success:false,
//             message:"un authorise user"
//         })
//     } else{
//         next()
//     }
// }

const userAuth= async(req,res,next)=>{
    //read the token from req cookies
    try{
    const cookies=req.cookies
    const {token}=cookies;
    if(!token){
        res.send("token is not valid")
    }

    //validate the token 
    const decodeData = await jwt.verify(token, "MAHI@94")
    const {_id}=decodeData

    const user=await User.findById(_id)
    if(!user){
        throw new Error("user not fouynd")
    }
    req.user=user  //attaching the user with req object
    next()
}
catch(err){
    res.status(400).send("ERROR " + err.message)

}


    //find the user

}

module.exports = {  userAuth }