const {Router} = require("express")
const adminModel = require("../models/admin")
const {adminAuth} = require('../middlewares/admin')
const {handleSignUp, handleSignIn, handleCourseAdd, handleCourseUpdate, handleCourseDelete, handleViewCourses} = require("../controllers/adminControllers")



const adminRouter = Router();


adminRouter.post("/signup",handleSignUp)

adminRouter.post("/signin",handleSignIn)



adminRouter.post("/course",adminAuth,handleCourseAdd)

adminRouter.put("/course/:id",adminAuth,handleCourseUpdate)

adminRouter.get("/course/view-all",adminAuth,handleViewCourses)

adminRouter.delete("/course/:id", adminAuth, handleCourseDelete)


module.exports = {
    adminRouter
}