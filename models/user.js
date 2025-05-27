const {Schema, mongo, default: mongoose} = require("mongoose")
const userSchema = Schema({
    email: {type: String, unique: true},
    passowrd: String,
    firstName: String,
    lastName: String
})
const userModel = mongoose.model("user", userSchema)

module.exports = {
    userModel 
}