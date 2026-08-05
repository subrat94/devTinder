const validator = require("validator")
const validateSignUp = (req) => {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName) {
        throw new Error("name is not valid")
    }
    else if (!validator.isEmail(email)) {
        throw new Error("enter a valid email ")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("enter a strong password")
    }
}

const validateEditProfile = (req) => {
    const allowEditFields = ["firstName", "lastName", "age", "gender", "about", "skills"]
    const isEditAllowed = Object.keys(req.body).every(field => allowEditFields.includes(field))
    return isEditAllowed

}

module.exports = { validateSignUp, validateEditProfile }