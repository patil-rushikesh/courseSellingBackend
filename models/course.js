const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageURL: String,
    creatorId: ObjectId
})

const courseModel = mongoose.model("course", courseSchema);

module.exports = {
    courseModel
}