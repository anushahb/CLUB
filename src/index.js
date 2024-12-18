import dotenv from "dotenv"
import {connectDB} from "./db/index.js"

import {app} from "./app.js"

dotenv.config();

// console.log("started")
connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is listening in ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log( error);
})