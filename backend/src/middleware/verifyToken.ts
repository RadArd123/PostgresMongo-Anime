import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ExtendedRequest } from '../interfaces/request.types';


export const verifyToken = async (req:ExtendedRequest, res:Response, next:NextFunction) => {
    const token  = req.cookies.token;
    try{
        if(!token){
            return res.status(401).json({success: false, message: "Unauthorized"});
        }
        const secret = process.env.JWT_SECRET;
        if(!secret){
            console.error("JWT_SECRET is not defined in environment");
            return res.status(500).json({success: false, message: "Internal server error"});
        }

        const decoded = jwt.verify(token, secret) as {
            isAdmin: boolean; id: number; iat: number; exp: number 
};
        if(!decoded){
            return res.status(401).json({success: false, message: "Unauthorized-invalid token"});
        }
        req.user = { id: decoded.id, isAdmin: decoded.isAdmin };
        next();
    }catch(err){
        console.log("Error verifying token", err);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
    
};