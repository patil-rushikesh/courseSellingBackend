
const z = require('zod')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { adminModel } = require('../models/admin')
const { courseModel } = require('../models/course')

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
            email, password: hashedPassword, firstName, lastName
        })
    } catch (err) {
        return res.status(400).json({
            message: "You are Already Signed Up"
        })
    }
    return res.json(201).json({
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
    const admin = await adminModel.findOne({
        email: email
    })
    if (!admin) {
        return res.status(403).json({
            message: "Invalid Credentials!"
        })
    }
    const passwordMatch = await bcrypt.compare(password, admin.password)
    if (passwordMatch) {
        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
        res.status(200).json({
            token: token,
        })
    } else {
        res.status(403).json({
            message: "Invalid Credentials!"
        })
    }
}

const handleCourseAdd = async (req, res) => {
    const adminId = req.adminId
    const requiredBody = z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        imageURL: z.string().url(),
        price: z.number().positive()
    })
    const parseData = requiredBody.safeParse(req.body)
    if (!parseData.success) {
        return res.json({
            message: "Incorrect data format",
            error: parseData.error
        })
    }
    const { title, description, imageURL, price } = req.body
    const course = await courseModel.create({
        title,
        description,
        imageURL,
        price,
        creatorId: adminId,
    })

    res.status(201).json({
        message: "Course Created!",
        courseId: course._id
    })
}
const handleCourseUpdate = async (req, res) => {
    const adminId = req.adminId;
    const courseId = req.params.id;

    const requireBody = z.object({
        title: z.string().min(5).optional(),
        description: z.string().min(5).optional(),
        imageURL: z.string().url().optional(),
        price: z.number().positive()
    })

    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        return res.json({
            message: "Incorrect data format",
            error: parseData.error
        })
    }

    const { title, description, imageURL, price } = req.body
    const course = await courseModel.findOne({
        _id: courseId,
        creatorId: adminId
    })
    if (!course) {
        return res.status(404).json({
            message: "Course Not Found!"
        })
    }
    await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title || course.title,
        description: description || course.description,
        imageURL: imageURL || course.imageURL,
        price: price || course.price
    })
    res.status(200).json({
        message: "Course Updated!"
    })
}
const handleCourseDelete = async (req, res) => {
    const adminId = req.adminId
    const courseId = req.params.id

    const course = await courseModel.findOne({
        _id: courseId,
        creatorId: adminId
    })

    if (!course) {
        return res.status(404).json({
            message: "Course Not Found!"
        })
    }
    await courseModel.deleteOne({
        _id: courseId,
        creatorId: adminId,
    });
    res.status(200).json({
        message: "Course Deleted!"
    })

}
const handleViewCourses = async (req, res) => {
    const adminId = req.adminId;
    const courses = await courseModel.find({
        creatorId: adminId,
    });
    res.status(200).json({
        courses: courses,
    });
}
module.exports = {
    handleSignUp, 
    handleSignIn, 
    handleCourseAdd, 
    handleCourseUpdate, 
    handleCourseDelete, 
    handleViewCourses
}