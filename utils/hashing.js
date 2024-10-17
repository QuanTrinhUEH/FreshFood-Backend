import bcrypt from 'bcrypt'

class krypto {
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
    decrypt(password, salt) {
        try {
            return bcrypt.hashSync(password, salt)
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
}

const kryptoService = new krypto();
export default kryptoService