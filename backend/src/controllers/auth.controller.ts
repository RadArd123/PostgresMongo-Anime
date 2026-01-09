
import {Request, Response} from "express";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import {  DbUser } from "../interfaces/auth.types";
import {authModel} from "../model/auth.model";
import { signupSchema, loginSchema } from "../schemas/auth.schemas";
import { z } from "zod";
import {ExtendedRequest } from "../interfaces/request.types";

export const signup = async (req:Request, res:Response) => {

    try{
        const validateData = signupSchema.parse(req.body);
        const {username, password, email} = validateData;

        const user = await authModel.signup({username, password, email} as DbUser);
        generateTokenAndSetCookie(res, user.id, user.is_admin);
    
        res.status(201).json({message: "User created successfully", user: user});
      
    }catch(err: any){
        if(err instanceof z.ZodError){
            return res.status(400).json({message: "Invalid data", err})
        }
        if(err.message === "Username or email already exists"){
            return res.status(409).json({ message: "Username or email already in use."})
        }
        console.error(err);
        res.status(500).json({ message: "Server error during signup." });
    }
};
export const login = async (req:Request, res:Response) => {
    try{
        const validateData = loginSchema.parse(req.body)
        const {username, password} = validateData;

        const user = await authModel.login({username, password} as DbUser);

        generateTokenAndSetCookie(res, user.id, user.is_admin);
        res.status(200).json({message: "Login successful", user: {id: user.id, username: user.username, email: user.email}});

     }catch(err: any){
        if(err instanceof z.ZodError){
            return res.status(400).json({message: "Invalid data", err})
        }
        if (err.message === "Invalid username or password") {
      
        return res.status(401).json({ message: "Invalid username or password." });
        }
        console.error(err);
        res.status(500).json({ message: "Server error during login." });
    }
};
export const logout = (req:Request, res:Response) => {
    res.clearCookie("token");
    res.status(200).json({message: "Logout successful"});
};
export const checkAuth = async (req:ExtendedRequest, res:Response) => {
    try{
        const userId = req.user?.id;
        if(!userId){
            return  res.status(401).json({message: "Unauthorized"});
        }
        const isAdmin = req.user?.isAdmin || false;
        res.status(200).json({message:"Authenticated", success:true, isAdmin: isAdmin});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error during authentication check.", error: err });
    }
};