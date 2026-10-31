const mongoose = require("mongoose")
const blacklistedTokenSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    token: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("BlacklistToken", blacklistedTokenSchema)