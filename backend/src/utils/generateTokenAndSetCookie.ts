import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateTokenAndSetCookie = (res: Response, userId: number) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    const token  = jwt.sign({
        id: userId
    },
    secret, {
        expiresIn: '10h',
    });
    res.cookie("token", token, {
        httpOnly: true, //xss
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",//csrf
        maxAge: 10*60*60*1000,
    });
        return token;
}
