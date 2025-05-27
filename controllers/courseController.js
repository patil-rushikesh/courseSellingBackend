const { purchaseModel } = require("../models/purchase")

const coursePurchaseController = async (req,res)=>{
    const userId = req.userId
    const courseId = req.body.courseId

    if(!courseId){
        return res.status(400).json({
            message: "Please provide a courseId"
        })
    }

    const existingPurchase = await purchaseModel.findOne({
        courseId: courseId,
        userId : userId
    })

    if(existingPurchase){
        return res.status(400).json({
            message: "You have already bought this course!"
        })
    }
    await purchaseModel.create({
        courseId: courseId,
        userId : userId
    })
    res.status(201).json({
        message: "You successfully bought this course"
    })
}

const viewCoursesController = async (req,res)=>{
    const courses = await courseModel.find({})
    if(!courses){
        return res.status(404).json({
            message: "No Courses Found"
        })
    }
    res.status(200).json({
        courses: courses
    })
}
module.exports = {
    coursePurchaseController,
    viewCoursesController
}