import {Router} from "express";

import {userRegister,userLogin,userLogout,changecurrentPassword} from "../controllers/user.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {addClub,clubsOverview,clubRegister,clubRegistrationDetails} from "../controllers/club.controller.js"

import {eventRegistrationDetails} from "../controllers/event.controller.js"
import {verifyPresident} from "../middlewares/president.middleware.js";

import {upload} from "../middlewares/multer.middleware.js";
const userRoute =Router(); 

userRoute.route("/register").post(userRegister);

userRoute.route("/login").post(userLogin);

userRoute.route("/logout").post(verifyJWT,userLogout)

userRoute.route("/changepassword").post(verifyJWT,changecurrentPassword)


userRoute.route("/addclub").post(verifyJWT,verifyPresident,upload.single("coverImage"),addClub)

userRoute.route("/clubregdetails").post(verifyJWT,verifyPresident,clubRegistrationDetails)

userRoute.route("/clubpage").get(verifyJWT,clubsOverview)

userRoute.route("/clubregister").get(verifyJWT,clubRegister)


userRoute.route("/eventregdetails").post(verifyJWT,verifyPresident,upload.single("eventPictures"),eventRegistrationDetails);
export {userRoute}