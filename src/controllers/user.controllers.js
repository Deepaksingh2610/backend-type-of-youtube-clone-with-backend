 import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from  "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefereshTokens = async(userId)=> {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken 
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}


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
//   console.log("email:", email);
 // validations
  if(
    [fullName, email, username, password].some((field)=>
        field?.trim() === " ")
  ){
    throw new ApiError(400, "All fields are required")
  }

  //check user alredy exists or not
 const existedUser= await User.findOne({
    $or:[{username},{email}]
  })
  if (existedUser){
    throw new ApiError(409, "User with this username and email is already exits")
  }

  //check images and avatar
const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath= req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
   coverImageLocalPath = req.files.coverImage[0].path
}

if (!avatarLocalPath){
    throw new ApiError(400, " Avatar file is required")
} 


//uploaded them to cloudinary
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

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

const loginUser = asyncHandler(async (req, res) =>{
    // req body se data le ayao
    // username , email based access same hai ya nhi
    //find the user
    //if user exits -> check password if same next step if not then password is wrong
    // access and refresh token
    //send cookie
    //response successfully login



    // request body se data lo
    const {email, username, password} = req.body

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    //username or email based access & find the user

   const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }


    // check password

   const isPasswordValid = await user.isPasswordCorrect(password)
   if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credintial ")
   }


   //access token and refresh token generation



   const {accessToken, refreshToken} = await
    generateAccessAndRefereshTokens(user._id)

   const loggedUser = await User.findById(user._id).
   select("-password -refreshToken" )

   //send to cookiees
   const options = {
    httpOnly : true,
    secure : true
   }
   return res
   .status(200)
   .cookie("accessToken", accessToken,options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiResponse(
        200,{
            user:loggedUser, accessToken,
            refreshToken
        },
        "user logged in Successfully"
    )
   )

})

const logoutUser = asyncHandler(async(req, res)=>{
    //find user and by using id
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            }
           
        },
         {
                new: true
            }
    )
    const options = {
        httpOnly:true,
        secure:true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{}, "User logged out"))

})

const refreshAccessToken = asyncHandler(async (req,res)=>{
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken


if (!incomingRefreshToken) {
    throw new ApiError(401,"unauthorised request")
}

try {
    const decodedToken = jwt.verify(
        incomingRefreshToken, 
        process.env.REFRESH_TOKEN_SECRET
    )
    
    const user = await User.findById(decodedToken?._id)
    
    if (!user) {
        throw new ApiError(401,"unathorised invalid refresh token") 
    }
    
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401,"refresh token is expried and used")   
    }
    
    const options = {
        httpOnly:true,
        secure:true
    }
    const { accessToken, newRefreshToken}=await generateAccessAndRefereshTokens(user._id)
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
            200,
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed"
        )
    )
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
    
}
})

export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}