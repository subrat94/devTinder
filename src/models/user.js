//writing schema
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,

    },
    password: {
        type: String,
        required: true
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
module.exports = mongoose.model("User", userSchema)