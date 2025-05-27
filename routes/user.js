const {Router} = require("express");
const userModel = require("../models/user")
const {handleSignIn, handleSignUp, handlePurchases} = require('../controllers/userControllers')
const {userAuth} = require('../middlewares/user')
const userRouter = Router();

userRouter.post("/signup", handleSignUp)

userRouter.post("/signin",handleSignIn)

userRouter.get("/purchases",userAuth,handlePurchases)

module.exports = {
    userRouter
}
