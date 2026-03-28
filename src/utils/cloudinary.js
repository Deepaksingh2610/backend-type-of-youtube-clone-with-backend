import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
 const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        //file has been uploaded successfuly
        fs.unlinkSync(localFilePath)
        // Always return secure https url and duration
        return {
           url: response.secure_url,
           public_id: response.public_id,
           duration: response.duration || 0
        }
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporey files as the upload operation failed
        return null;
    }
 }


 export {uploadOnCloudinary}
