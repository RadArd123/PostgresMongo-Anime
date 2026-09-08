import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import type { AuthResponse } from "../interfaces/auth.types";


export const useAuthStore = create<AuthResponse>((set) => ({
    user: null,
    isAuthenticated: false,
    hasCheckedAuth: false,
    isAdmin: false,
    error: null,
    isLoading: false,
    message: null,
    

    signup: async(username:string, email:string, password:string) => {
        set({isLoading:true, error:null});
        try{
            const response = await axiosInstance.post("/auth/signup", { username, email, password });
            set({user: response.data.user, isAuthenticated:true, isAdmin: response.data.user?.isAdmin || false, message: response.data.message});  
        }catch(err:any){
            set({error: err.response?.data?.message || "Signup failed"});
        } finally{
            set({isLoading:false});
        }
    },
    login: async(username:string, password:string) => {
        set({isLoading:true, error:null});
        try{
            const response = await axiosInstance.post("/auth/login", { username, password });
          
            set({user: response.data.user, isAuthenticated:true, isAdmin: response.data.user?.isAdmin || false, message: response.data.message});  
          
        }catch(err:any){
            set({error: err.response?.data?.message || "Login failed"});
        } finally{
            set({isLoading:false});
        }
    },
    logout: async() => {
        set({isLoading:true, error:null});
        try{
            const response = await axiosInstance.post("/auth/logout");
            set({user: null, isAuthenticated:false, isAdmin:false, message: response.data.message});
        }catch(err:any){
            set({error: err.response?.data?.message || "Logout failed"});
        } finally{
            set({isLoading:false});
        }   
    },
    checkAuth: async() => {
        set({isLoading:true, error:null});  
        try{
            const response = await axiosInstance.get("/auth/check-auth");
            set({
                user: response.data.user,
                isAuthenticated: true,
                message: response.data.message,
                isAdmin: response.data.isAdmin,
                error: null,
            });
        }catch(err:any){
            if (err.response?.status === 401) {
                set({ user: null, isAuthenticated: false, isAdmin: false, error: null });
            } else {
                set({error: err.response?.data?.message || "Authentication check failed"});
            }
        } finally{
            set({isLoading:false, hasCheckedAuth:true});
        }   
    },
    
}))
