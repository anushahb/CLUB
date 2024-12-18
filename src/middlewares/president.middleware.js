import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyPresident=asyncHandler(async (req,res,next)=>{

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    // console.log(req.cookies)
    // console.log("Token:", token);
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token is missing");
    }
    
    try {
      const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    // console.log(user.role);
   
      if (!user) {
        throw new ApiError(401, "Invalid access token: User not found");
      }
      if(user.role!="president"){
        throw new ApiError(402, "Invalid ...unauthorized user");

    }
      req.user = user;
      
      next();
    } catch (error) {
      console.log("Error:", error);
      throw new ApiError(401, "unauthorized token: " + error.message);
    }
    
})