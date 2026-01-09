import type { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";


export const uploadToCloudinary = async (file: UploadedFile):Promise<string> => {
    try{
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto', 
        });
        return result.secure_url;
    }catch(err:any){
        console.log("Error in uploading to Cloudinary", err);
        throw new Error('Failed to upload file to Cloudinary');
    }
}