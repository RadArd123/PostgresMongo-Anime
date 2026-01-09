
export interface DbUser {
    id: number; // or string if UUID
    username: string;
    email: string;
    password: string; // The hashed password
    is_admin: boolean;
    created_at?: Date; // Optional: if you have timestamps
}
