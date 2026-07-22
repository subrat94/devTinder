 const adminAuth = (req, res, next) => {
    console.log("checking auth middleware");

    const token = "xyz";
    const isAuthorised = token === "xyz"
    if (!isAuthorised) {
        res.status(401).json({
            success: false,
            message: "unAuthorised user"
        })
    } else {
        next()
    }

}

const userAuth=(req,res,next)=>{
    console.log("user authentication checking");
    
    const token="xyxy"
    const isAuthoriseUser=token==="xyxy"
    if(!isAuthoriseUser){
        res.status(401).json({
            success:false,
            message:"un authorise user"
        })
    } else{
        next()
    }
}

module.exports = { adminAuth, userAuth }