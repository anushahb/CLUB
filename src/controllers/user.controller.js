import {uploadOnCloudinary} from "../utils/cloudinary.js"

import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

import {User} from "../models/user.model.js"




const generateAccessAndRefreshToken=async (userId)=>{
    try{
        //server side these tokens are generated
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        //user.email like that
        //saving in the user database 
        user.refreshToken=refreshToken;
        //when saved without param password also should be validated  ..which we already used during login
        //no need of validation
        await user.save({validateBeforeSave:false})
        // console.log(accessToken,refreshToken);

        return {accessToken,refreshToken}





    }catch(error){
        throw new ApiError(500,"something went wrong while generating access token")
    }

}

const userRegister=asyncHandler(async (req,res)=>{
    const {userName,email,fullName,year,branch,password,role}=req.body


    if(!(userName&&email&&fullName&&year&&branch&&password)){
        throw new ApiError(400,"Please enter all the fields")
    }
   
    if(email.indexOf("@rvce.edu.in")==-1){
        throw new ApiError(400,"please enter the RVCE gmail correctlty")

    }
   

    const existedUser=await User.findOne({email})

    if(existedUser){
        throw new ApiError(409,"User with email already exist")
    }

    if(role=="president")
        if(password!="admin"){
        throw new ApiError(409,"you are not a president ans unauthorized")
    }
    if(role=="user"){
        if(password=="admin"){
            throw new ApiError(409,"you are not a president ans unauthorized")

        }
    }
    
    
    const user=await User.create(
        {
            email:email.toLowerCase(),
            userName:userName.toLowerCase(),
            fullName,
            year,
            branch,
            password,
            role,



        }
    )


    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken -events -clubs -transactions -totalActivityPoints"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user")

    }


    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registed successfully")

    ) 
})






//LOGIN
const userLogin=asyncHandler(async (req,res)=>{
    const{email,password}=req.body

    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(400,"user doesnot exist")
    }
    console.log(password)
    const passwordVerify=await user.isPasswordCorrect(password);
    console.log(passwordVerify)
    if(!passwordVerify)
    {
        throw new ApiError(400,"password is incorrect")

    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    // const {accessToken,refreshToken}=generateAccessAndRefreshToken(user._id);
    // console.log(accessToken,refreshToken)
    console.log(accessToken,refreshToken)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken -events -clubs -transactions -totalActivityPoints");


    const options={
        httpOnly:true,
        secure:true

    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,accessToken,refreshToken
        },
    "user loggedin successfully"
        ))
})


//LOGOUT
const userLogout=asyncHandler(async (req,res)=>{
    console.log(req.user)

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined,
            }
        },
        {
            //next db acces should new not old
            new:true   
        }
    )



    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user logged out")
    )

})


//CHANGE PASSWORD
const changecurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    if(!oldPassword && !newPassword){
        throw new ApiError(400,"please enter password")

    }
    
    const user=await User.findById(req.user?._id)
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"password is incorrect")
    }

    user.password=newPassword;
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"password set succesfuully")
    )
})


export {userRegister,userLogin,userLogout,changecurrentPassword}