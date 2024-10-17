import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import fs from 'fs'

config();

const cloudinaryConfig = {
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
}
cloudinary.config(cloudinaryConfig);


class imageHandler {
    async postSingleImage(filePath, folder) {
        return await cloudinary.uploader.upload(filePath, { public_id: Math.ceil(Math.random() * Date.now() + Math.random() * Date.now()), folder }, (err, res) => {
            if (err) {
                fs.unlinkSync(filePath)
                throw (
                    {
                        message: err.message || err,
                        status: 500,
                        data: null
                    }
                )
            }
        })
    }

    async postMultipleImages(imagesPath, folder) {
        let result = [];
        for (const image in imagesPath) {
            const response = await cloudinary.uploader.upload(imagesPath[image], { public_id: Math.ceil(Math.random() * Date.now() + Math.random() * Date.now()), folder }, ((err, res) => {
                if (err) {
                    result.map(e => fs.unlinkSync(e))
                    throw (
                        {
                            message: err.message || err,
                            status: 500,
                            data: null
                        }
                    )
                }
            }));
            result.push(response)
        }
        return result;

    }
}
const cloudinaryService = new imageHandler();
export default cloudinaryService