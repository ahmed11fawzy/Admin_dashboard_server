import jwt, { Secret, SignOptions } from "jsonwebtoken";

export const generateToken = (user)=> {
    const payload = { id: user._id, role: user?.role, status: user?.status };
    const secret = (process.env.JWT_SECRET ) ;
    const options = { 
        expiresIn: Number(process.env.JWT_EXPIRATION) || '1h'
    };
    return jwt.sign(payload, secret, options);
};

export const verifyToken = (token) => {
    try {   
        const secret = (process.env.JWT_SECRET ) ;
        return jwt.verify(token, secret);
    }
    catch (error) {
        return null;
    }
}