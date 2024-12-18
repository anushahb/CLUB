import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


cloudinary.config({ 
        cloud_name: "dnga4gkbe", 
        api_key: "776667111429756", 
        api_secret: "BNc-wxA8kQXJzVSCn3vqlfvBz9w"
    });


    const uploadOnCloudinary = async (localFilePath)=>{
        try{
            if (fs.existsSync(localFilePath)) {
                console.log('File existing true:', localFilePath);
            }
            
    
            console.log("Uploading file from:", localFilePath);
    
            if(!localFilePath) return null;
            //upload the file on cloudinary
            const response=await cloudinary.uploader.upload(
                localFilePath,
                {
                    //any type of file
                    resource_type:"auto"
                }
            );
            //file has been uploaded successfully
            console.log(`File is uploaded in cloudinary ${response.url}`)
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            return response;
        }catch(error){
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            
            console.error("Error uploading file to Cloudinary:", error);
            //remove the locally saved temporary file as the upload
            //operation got failed-->try uplaoding next tinme
            return null;
        }
    }
    
    export {uploadOnCloudinary}