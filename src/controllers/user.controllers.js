 import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from  "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser =  asyncHandler(async (req, res)=>{
    //get user details from frontend ->we can take details from postman->req.body->(from or json se data aye tho) for url we have different methods
    // validations
    // check if user already exists:username and email
    //files hai ya nhi-> check for avtar and coverimages
    //upload them to cloudinary
    //check at cloudinary & multer that image or avatar is uploaded or not
    // create user object->beacuse is noSql data base everthing goes in object forms-create entry in db
    //remove password and refresh token filed from response
    // check for user creation 
    //return response

// get user details
  const {fullName, email, username, password}  = req.body
  console.log("email:", email);
 // validations
  if(
    [fullName, email, username, password].some((field)=>
        field?.trim() === " ")
  ){
    throw new ApiError(400, "All fields are required")
  }

  //check user alredy exists or not
 const existedUser=  User.findOne({
    $or:[{username},{email}]
  })
  if (existedUser){
    throw new ApiError(409, "User with this username and email is already exits")
  }

  //check images and avatar
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath= req.files?.coverImage[0]?.path;
if (!avatarLocalPath){
    throw new ApiError(400, " Avatar file is required")
} 


//uploaded them to cloudinary
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = uploadOnCloudinary(coverImageLocalPath)

// check avatar is properly uploaded and working or not

if (!avatar) {
    throw new ApiError(400, " Avatar file is required")
}

//create object and give entery to db

 const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || " ",
    email,
    password,
    username: username.toLowerCase()
})
 //checking user got saved in db or we get user in db or not 
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
 if (!createdUser) {
    throw new ApiError(500, "something went wrong while regsitring")
 }
 // check Api response
 return res.status(201).json(
    new ApiResponse(200, createdUser, "user registred successfully")
 )

})
export {registerUser}