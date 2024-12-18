import {uploadOnCloudinary} from "../utils/cloudinary.js"

import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

import {User} from "../models/user.model.js"
import {Club} from "../models/club.model.js"

import { MongoClient } from 'mongodb';
import {MONGODB_NAME} from "../constant.js"

import {Transaction} from "../models/transaction.model.js"




const eventRegistrationDetails=asyncHandler(async (req,res)=>{
    console.log(req.user);
    console.log(req.user.role);
    console.log(req.user.clubs);


    const {clubOrganizing,venue,eventName,date,description,activityPoints}=req.body;
    if(!(clubOrganizing && venue &&eventName && date && description && activityPoints)){
        throw new ApiError(400,"please enter all the fields")
    }

    const eventPicturesPath=req.file.path;
    const eventPicture=await uploadOnCloudinary(eventPicturesPath);

    const eventRegistrationDetails={
        
    }


})




export {eventRegistrationDetails}