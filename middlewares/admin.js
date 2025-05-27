const jwt = require('jsonwebtoken')

const adminAuth = async(req, res, next) => {
    const token = req.headers.authorization;
    try{
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD)
        req.userId = decoded.id;
        next()
    } catch(err){
        return res.status(403).json({
            message: "You are Not Signed in!"
        })
    }
}

module.exports = {
    adminAuth
}