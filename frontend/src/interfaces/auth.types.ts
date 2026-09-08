export interface AuthUser {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
}
export interface AuthResponse {
    user: AuthUser | null;
    isAuthenticated: boolean;
    hasCheckedAuth: boolean;
    error: string | null;
    isLoading: boolean;
    message?: string | null;
    isAdmin: boolean;
    signup: (username:string, email:string, password:string) => Promise<void>;
    login: (username:string, password:string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;

}
