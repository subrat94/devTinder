const mongoose = require("mongoose")

const connectDB = async () => {

    await mongoose.connect("mongodb+srv://mahisubrat94_db_user:Subrat%40123@cluster0.cvuety6.mongodb.net/DevTender")

}
module.exports = connectDB