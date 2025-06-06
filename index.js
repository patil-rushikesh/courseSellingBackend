const express = require("express")
const {userRouter} = require('./routes/user')
const {adminRouter} = require('./routes/admin')
const {courseRouter} = require('./routes/course')
const connectDB = require("./config/db")

require('dotenv').config()

const app = express()
connectDB();
app.use(express.json())

app.use("/api/v1/user", userRouter) 
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/course", courseRouter)


app.listen(process.env.PORT, ()=>{
    console.log(`Listening on PORT ${process.env.PORT}`)
})