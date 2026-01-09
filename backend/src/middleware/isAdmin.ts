import type { NextFunction , Response, Request} from "express"
import { ExtendedRequest } from "../interfaces/request.types";
export const isAdmin = (req:ExtendedRequest, res: Response, next: NextFunction) => {
    if(!req.user || !req.user.isAdmin){
        return res.status(403).json({ message: "Forbidden: Requires admin role" });
    }
    next();
}