const z = require('zod')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {userModel} = require('../models/user')
const { purchaseModel } = require('../models/purchase')
const {courseModel} = require('../models/course')

const handleSignUp = async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email().min(5),
        password: z.string().min(5),
        firstName: z.string().min(3),
        lastName: z.string().min(3)
    })
    const parseData = requiredBody.safeParse(req.body)
    if (!parseData.success) {
        return res.json({
            message: "Incorrect data Format",
            error: parseData.error
        })
    }
    const { email, password, firstName, lastName } = req.body
    const hashedPassword = await bcrypt.hash(password, 5)
    try {
        await userModel.create({
            email, 
            password: hashedPassword, 
            firstName, 
            lastName
        })
    } catch (err) {
        return res.status(400).json({
            message: "You are Already Signed Up"
        })
    }
    return res.status(201).json({
        message: "SignUp Successfull!"
    })
}
const handleSignIn = async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })
    const parseData = requiredBody.safeParse(req.body);
    if (!parseData) {
        return res.json({
            message: "Incorrect Data Format",
            error: parseData.error
        })
    }
    const { email, password } = req.body
    const user = await userModel.findOne({
        email: email
    })
    if (!user) {
        return res.status(403).json({
            message: "Invalid Credentials!"
        })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (passwordMatch) {
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
        res.status(200).json({
            token: token,
        })
    } else {
        res.status(403).json({
            message: "Invalid Credentials!"
        })
    }


}
const handlePurchases = async (req, res) => {
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId: userId
    })
    if (!purchases) {
        return res.json({
            message: "No Purchases Found",
        })
    }

    const purchaseCourseIds = purchases.map((purchase) => {
        purchase.courseId
    })

    const courseData = await courseModel.find({
        _id: {
            $in: purchaseCourseIds
        }
    })
    res.status(200).json({
        purchases,
        courseData
    })
}

module.exports = {
    handleSignIn, handleSignUp, handlePurchases
}