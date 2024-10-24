import bcrypt from 'bcrypt'

class Encode {
    encrypt(password) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            return [hashPassword, salt]
        }
        catch (e) {
            throw (
                {
                    message: e.message,
                    status: 500,
                    data: null
                }
            )
        }
    }
    decrypt(password, hashPassword) {
        try {
            if (!password || !hashPassword) {
                throw new Error('Password and hash are required');
            }
            return bcrypt.compareSync(password, hashPassword);
        } catch (e) {
            throw {
                message: e.message,
                status: 500,
                data: null
            };
        }
    }
}

const encodeService = new Encode();
export default encodeService
