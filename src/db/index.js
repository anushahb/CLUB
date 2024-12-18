import mongoose from "mongoose"
import {MONGODB_NAME} from "../constant.js"


const connectDB=( async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${MONGODB_NAME}`)
        console.log("MONGODB connected!!! ",connectionInstance.connection.host)
    } catch (error) {
        console.log("DB not connected");
        console.log( error);
        process.exit(1);
        
    }
})


export {connectDB}