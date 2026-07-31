//writing schema
const mongoose = require("mongoose")
const validator=require("validator")
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:3,
        maxlength:15
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        validate(value){ //email validation
            if(!validator.isEmail(value)){
                throw new Error("this is not a valid email " + value)
            }
        }

    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("this is not a strong password " + value)
            }

        }
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String
    },
    photourl: {
        type: String
    },
    about: {
        type: String,
        default:"this one is default value for about "
    },
    skills: {
        type: [String]
    },
},{
    timestamps:true
})

userSchema.methods.getJWT= async function (){
    const user=this
    const token= await jwt.sign({ _id: this._id }, "MAHI@94", { expiresIn: '7d' });
    return token
}
module.exports = mongoose.model("User", userSchema)