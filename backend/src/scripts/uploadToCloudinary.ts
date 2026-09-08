import type { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";


export const uploadToCloudinary = async (file: UploadedFile):Promise<string> => {
    try{
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        });
        const url = result.secure_url;
        // Auto-optimize by converting format to webp/avif and optimizing quality
        if (url.includes('/upload/') && !url.includes('/upload/f_auto,q_auto/')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    }catch(err:any){
        console.log("Error in uploading to Cloudinary", err);
        throw new Error('Failed to upload file to Cloudinary');
    }
}
