
import { Request, Response } from "express";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import { DbUser } from "../interfaces/auth.types";
import { authModel } from "../model/auth.model";
import { signupSchema, loginSchema, deleteAccountSchema } from "../schemas/auth.schemas";
import { z } from "zod";
import { ExtendedRequest } from "../interfaces/request.types";

export const signup = async (req: Request, res: Response) => {

    try {
        const validateData = signupSchema.parse(req.body);
        const { username, password, email } = validateData;

        const user = await authModel.signup({ username, password, email } as DbUser);
        generateTokenAndSetCookie(res, user.id);

        res.status(201).json({ message: "User created successfully", user: { ...user, isAdmin: user.is_admin } });

    } catch (err: any) {
        if (err instanceof z.ZodError) {
            console.error("ZodError:", JSON.stringify(err.issues, null, 2));
            const issues = err.issues ?? (err as any).errors ?? [];
            const errorMessage = issues[0]?.message || "Invalid data";
            return res.status(400).json({ message: errorMessage })
        }
        if (err.message === "Username or email already exists") {
            return res.status(409).json({ message: "Username or email already in use." })
        }
        console.error(err);
        res.status(500).json({ message: "Server error during signup." });
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        const validateData = loginSchema.parse(req.body)
        const { username, password } = validateData;

        const user = await authModel.login({ username, password } as DbUser);

        generateTokenAndSetCookie(res, user.id);
        res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email, isAdmin: user.is_admin } });

    } catch (err: any) {
        if (err instanceof z.ZodError) {
            console.error("ZodError:", JSON.stringify(err.issues, null, 2));
            const issues = err.issues ?? (err as any).errors ?? [];
            const errorMessage = issues[0]?.message || "Invalid data";
            return res.status(400).json({ message: errorMessage })
        }
        if (err.message === "Invalid username or password") {

            return res.status(401).json({ message: "Invalid username or password." });
        }
        console.error(err);
        res.status(500).json({ message: "Server error during login." });
    }
};
export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
};
export const checkAuth = async (req: ExtendedRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json({
            message: "Authenticated",
            success: true,
            isAdmin: user.isAdmin,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during authentication check.", error: err });
    }
};

export const deleteAccount = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { password } = deleteAccountSchema.parse(req.body);
        await authModel.deleteUser(userId, password);

        // Stergem si cookie-ul de autentificare
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.issues[0]?.message || "Invalid data" });
        }
        if (err.message === "Invalid password") {
            return res.status(401).json({ message: "Invalid password" });
        }
        console.error("Error in deleteAccount:", err);
        res.status(500).json({ message: err.message || "Server error during account deletion." });
    }
};
