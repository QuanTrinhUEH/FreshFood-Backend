import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

const cloudinaryConfig = {
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
}
cloudinary.config(cloudinaryConfig);

class ImageService {
    // saveSingleImg(path) {
    //     try {
    //         const storage = multer.diskStorage({
    //             destination: (req, file, cb) => {
    //                 cb(null, `images/${path}/`)
    //             },
    //             filename: (req, file, cb) => {
    //                 cb(null, (Math.ceil(Math.random() * Date.now())) + (Math.ceil(Math.random() * Date.now())) + '.jpg')
    //             }
    //         })
    //         const upload = multer({ storage: storage })
    //         return upload.single(path)
    //     }
    //     catch (e) {
    //         throw (
    //             {
    //                 message: e.message || e,
    //                 status: 500,
    //                 data: null
    //             }
    //         )
    //     }
    // }
    // saveMultipleImg(path) {
    //     try {
    //         const storage = multer.diskStorage({
    //             destination: (req, file, cb) => {
    //                 cb(null, `images/${path}/`)
    //             },
    //             filename: (req, file, cb) => {
    //                 cb(null, (Math.ceil(Math.random() * Date.now())) + (Math.ceil(Math.random() * Date.now())) + '.jpg')
    //             }
    //         })
    //         const upload = multer({ storage: storage }).array(path);
    //         return upload
    //     }
    //     catch (e) {
    //         throw (
    //             {
    //                 message: e.message || e,
    //                 status: 500,
    //                 data: null
    //             }
    //         )
    //     }
    // }



    async uploadImageToCloudinary(file) {
        return new Promise((resolve, reject) => {
            const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const fileName = file.originalname.split('.')[0];

            cloudinary.uploader.upload(dataUrl, {
                public_id: fileName,
                resource_type: 'auto',
            }, (err, result) => {
                if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(err);
                }
            });
        });
    }
}

const imageService = new ImageService()

export default imageService;
