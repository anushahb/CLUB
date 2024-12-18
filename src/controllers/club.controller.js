import {uploadOnCloudinary} from "../utils/cloudinary.js"

import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

import {User} from "../models/user.model.js"

import {Club} from "../models/club.model.js"

import { MongoClient } from 'mongodb';
import {MONGODB_NAME} from "../constant.js"

import {Transaction} from "../models/transaction.model.js"
 
const addClub=asyncHandler(async (req,res)=>{
   const {clubName,description}=req.body;
   const user=await User.findById(req.user._id);

   if(!clubName){
        throw new ApiError(400,"please enter clubname")
   }

   const clubExist=await Club.findOne({clubName});


   if(clubExist){
        throw new ApiError(400,"club already exist")
   }


   console.log(req.file)
   console.log(req.file.path)

    
    const coverImageLocalPath=req.file.path;
    console.log(coverImageLocalPath);

    if(!coverImageLocalPath){
        throw new ApiError(400,"local path not exist")
    }
    
    console.log(coverImageLocalPath);
   const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    console.log(coverImage)
   const club=await Club.create({
        clubName,
        description,
        coverImage:coverImage.url,
        president:req.user

   })


   return res
   .status(200)
   .json(
    new ApiResponse(200,club,"club added by president succesfully")
   )

})



const clubsOverview=asyncHandler(async (req,res)=>{


    // Replace with your MongoDB connection string

    const uri=process.env.MONGODB_URL+"/"+MONGODB_NAME;
    // Create a MongoDB client
    const client = new MongoClient(uri);
    let documents={};

    try {
        // Connect to the MongoDB Atlas cluster
        await client.connect();
        console.log("MongoDB Connected!");

        // Access a specific database
        const database = client.db(`${MONGODB_NAME}`); // Replace with your database name

        // Access a specific collection
        const collection = database.collection("clubs"); // Replace with your collection name

        // Perform operations (e.g., find all documents)
        documents = await collection.find({}).toArray(); // Fetch all documents
        console.log("Documents in collection:", documents);
        

    } catch (error) {
        console.error("Error accessing MongoDB:", error.message);
    } finally {
        // Close the connection
        await client.close();
        console.log("MongoDB Connection Closed.");
        return res
        .status(200)
        .json(
             new ApiResponse(200,{documents},"club details rendered succesfully")
        )
       
    }
})


const clubRegistrationDetails=asyncHandler(async (req,res)=>{
    const {startDate,endDate,fee,clubName}=req.body;

    

    if(!(startDate&&endDate&&fee&&clubName)){
        throw new ApiError(400,"please enter all the fields")

    }

    const start = new Date(startDate);
const end= new Date(endDate);

// Validate the dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.log("Invalid date format. Please enter valid dates.");
    } else if (start >= end) {
        console.log("Start date must be earlier than the end date.");
    } else {
        console.log("Dates are valid: Start date is earlier than the end date.");
    }


    const user=req.user
    const club=await Club.findOne({clubName})
    if(!club){
        throw new ApiError(400,"club doesnt exist")
    }


    const clubPresident=club.president
    console.log(clubPresident._id)
    console.log(user._id)
    if(!(clubPresident._id.equals(user._id))){
        throw new ApiError(400,"unauthorized u cannot update details for registeration")

    }

    const reg=await Club.findByIdAndUpdate(
        club._id,
        {
            $set:{
                "clubRegistrationDetails.startDate": start,  
                "clubRegistrationDetails.endDate":end,  
                "clubRegistrationDetails.fee":fee
            }
        },
        {
            new:true
        }
    )



    return res
    .status(200)
    .json(
        new ApiResponse(200,reg,"registration data updated")
    )
//     const pre=await Club.findOne({clubName}).select("president")
//     // const club=await Club.findOne({clubName})
//     const club = await Club.findOne({ clubName }).populate("president","userName");

//     if(!club){
//         throw new ApiError(400,"club doesnot exist")
//     }
//     const regu=await Club.findByIdAndUpdate(
//         club._id,
//         {
//             $set:{
//                "clubRegistrationDetails.startDate": new Date("2024-04-05"),  // Correct Date format
//           "clubRegistrationDetails.fee": 200,
//             }
//         }
//         ,{
//             new:true
//         }
//     )
//     console.log(regu)
//     const regd = await Club.findOne({ clubName }).populate("clubRegistrationDetails","startDate");
//     console.log(regd)
//     // console.log(club.getPresidentByClubName(clubName))
//         // const club = await Club.findOne({ clubName }).populate("president", "userName");
// // console.log(preName)
// console.log("hi");
//     console.log(club)
//     console.log(club.clubName)
//     const user=req.user;
//     console.log(user)
//     console.log(club.president)
//     console.log(club.president.userName)
//     console.log(club.president._id)
//     console.log(req.user._id)
})




const clubRegister=asyncHandler( async (req,res)=>{
    const {clubName,fee}=req.body
    const user=req.user
    const club=await Club.findOne({clubName})
    console.log(club)
    console.log(club.clubRegistrationDetails)
    console.log(club.clubRegistrationDetails.fee)
    const today=new Date();
    const startDate=club.clubRegistrationDetails.startDate
    const endDate=club.clubRegistrationDetails.endDate
    if(!(today>=startDate && today<=endDate)){
        if(today<startDate){
            throw new ApiError(400,"Registration not yet opened")

        }
        else{
            throw new ApiError(400,"Registration is closed ")

        }
    }


    if(club.clubRegistrationDetails.fee>0){
        if(!fee || fee<=0){

        
        throw new ApiError(400,"amount should be paid to register please pay the amount ")
    }
}



    const memberAdded=await Club.findByIdAndUpdate(
        club._id,
        {
            $set:{
                members:user._id
            }

        },
        {
            new:true
        }
    )


    console.log(memberAdded)




    //to add cub to the useerr

    console.log(user);
    console.log(user.clubs)

    console.log(user.transactions);


    const transaction=await Transaction.create(
        {
            paidFor:"Club",
            amount:fee,
            date:today,
            description:"paid"
        }
    )

    console.log(transaction)
    const clubAddingToUser=await User.findByIdAndUpdate(
        user._id,
        {
            $set:{
                clubs:club._id
                
            }
        },
        {
            new:true
        }
    )
    let transactionAddingToUser;
    if(fee>0){
        transactionAddingToUser=await User.findByIdAndUpdate(
            user._id,
            {
                $set:{
                    transactions:transaction._id
                }
            },
            {
                new:true
            }
        )
    }
   





    return res
    .status(200)
    .json(
        new ApiResponse(200,{memberAdded,transaction,clubAddingToUser,transactionAddingToUser},`registerd succesfully to ${clubName}`)
    )





})









export {addClub,clubsOverview,clubRegister,clubRegistrationDetails}