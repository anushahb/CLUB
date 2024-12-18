import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"





const app=express();

app.use(cors({
    //from where to accept
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//configuration wht to accept ,how much

app.use(express.json({limit:"50kb"}))

//to accept from URL
app.use(express.urlencoded({extended:true,limit:"50kb"}))

//what type of folder,pdf,img to store local
//"public"--> in which folder to save 
app.use(express.static("public"))

//to store cookies in user browser which is helpful for server
app.use(cookieParser());




import {userRoute} from "./routes/user.route.js"
app.use("/user",userRoute)


export {app}