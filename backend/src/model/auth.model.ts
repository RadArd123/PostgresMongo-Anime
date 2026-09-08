import { pool } from "../config/db";
import { DbUser } from "../interfaces/auth.types";
import bcrypt from "bcrypt";
import { SignupUserInput, type LoginUserInput } from "../schemas/auth.schemas";
import { profileModel } from "./profiles.model";

export const authModel = {
    signup: async (userData: SignupUserInput): Promise<DbUser> => {
        const { username, email, password } = userData;
        const existingUser = await pool.query<DbUser>(`SELECT * FROM users WHERE username = $1 OR email = $2`, [username, email]);
        if (existingUser.rows.length > 0) {
            throw new Error("Username or email already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query<DbUser>(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email", [username, email, hashedPassword]
        );
        const createdUser = newUser.rows[0];

        await profileModel.createProfile(createdUser.id);

        return createdUser;
    },
    login: async (userData: LoginUserInput): Promise<DbUser> => {
        const { username, password } = userData;
        const userResults = await pool.query<DbUser>("SELECT * FROM users WHERE username = $1", [username]);

        const user = userResults.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Aruncăm O SINGURĂ eroare generică
            throw new Error("Invalid username or password");
        }
        return user;
    },
    deleteUser: async (user_id: number, password: string): Promise<void> => {
        const existingUser = await pool.query<DbUser>('SELECT * FROM users WHERE id = $1', [user_id]);
        const user = existingUser.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid password');
        }

        const userResults = await pool.query("DELETE FROM users WHERE id = $1", [user_id]);
        if (userResults.rowCount !== 1) {
            throw new Error("User not found");
        }
    }

}
