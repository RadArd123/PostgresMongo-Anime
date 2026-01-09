export interface DbUser {
    id: number; // or string if UUID
    username: string;
    email: string;
    password: string; // The hashed password
    is_admin: boolean;
    created_at?: Date; // Optional: if you have timestamps
}
export interface AuthResponse {
    user: DbUser | null;
    isAuthenticated: boolean;
    error?: any;
    isLoading: boolean;
    message?: string | null;
    isAdmin: boolean;
    signup: (username:string, email:string, password:string) => Promise<void>;
    login: (username:string, password:string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;

}