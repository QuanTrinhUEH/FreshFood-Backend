import multer from 'multer';

class imageHandler {
    saveSingleImg(path) {
        try {
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, `images/${path}/`)
                },
                filename: (req, file, cb) => {
                    cb(null, (Math.ceil(Math.random() * Date.now())) + (Math.ceil(Math.random() * Date.now())) + '.jpg')
                }
            })
            const upload = multer({ storage: storage })
            return upload.single(path)
        }
        catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    }
    saveMultipleImg(path) {
        try {
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, `images/${path}/`)
                },
                filename: (req, file, cb) => {
                    cb(null, (Math.ceil(Math.random() * Date.now())) + (Math.ceil(Math.random() * Date.now())) + '.jpg')
                }
            })
            const upload = multer({ storage: storage }).array(path);
            return upload
        }
        catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    }
}

export const imageService = new imageHandler()