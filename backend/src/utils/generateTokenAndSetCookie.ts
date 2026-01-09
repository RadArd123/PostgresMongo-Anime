import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateTokenAndSetCookie = (res: Response, userId: number, isAdmin:boolean) => {
    const token  = jwt.sign({ 
        id: userId ,
        isAdmin: isAdmin
    },
    process.env.JWT_SECRET as string, {
        expiresIn: '10h',
    });
    res.cookie("token", token, {
        httpOnly: true, //xss
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",//csrf
        maxAge: 7*24*60*60*1000,
    });
        return token;
}
 