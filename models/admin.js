const {Schema, default: mongoose} = require("mongoose")
const adminSchema = new Schema({
    email: {type: String, unique: true},
    passowrd: String,
    firstName: String,
    lastName: String
})
const adminModel = mongoose.model("admin", adminSchema)

module.exports = {
    adminModel 
}