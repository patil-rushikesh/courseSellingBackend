const { Router } = require("express")
const { userAuth } = require("../middlewares/user");
const { viewCoursesController, coursePurchaseController } = require('../controllers/courseController')
const courseRouter = Router();

courseRouter.post("/purchase", userAuth, coursePurchaseController)

courseRouter.get("/preview", viewCoursesController)

module.exports = {
    courseRouter
}