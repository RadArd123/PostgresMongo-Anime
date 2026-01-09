import { Lock, Loader, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const {login, isLoading, error} = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      await login(username, password);   
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err?.message || "Login failed. Please try again.");
    }
  }

 
  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/60 
                      backdrop-blur-xl shadow-[0_0_60px_rgba(101,123,232,0.35)] overflow-hidden">
        <div className="p-8">
          {/* TITLE */}
          <h2 className="text-3xl font-extrabold text-center tracking-tight 
                         bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Log in to continue your anime journey.
          </p>

          {/* FORM */}
          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            {/* USERNAME */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-200">Username</label>
                 </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="username"
                  placeholder="Enter your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-gray-100 
                             placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:ring-2"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-200">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-gray-100 
                             placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:ring-2"
                />
              </div>
                  <button
                  type="button"
                  className="text-xs text-gray-400 hover:text-[#657be8] transition"
                >
                  Forgot password?
                </button>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-400 font-semibold">{error}</p>
            )}

            {/* BUTTON */}
            <Button
              type="submit"
              className="mt-2 w-full py-3 text-base font-bold rounded-2xl 
                         bg-linear-to-r from-indigo-500 to-blue-500 
                         hover:brightness-120 hover:shadow-[0_10px_30px_rgba(101,123,232,0.5)]
                         focus-visible:ring-2 focus-visible:ring-offset-2 
                         focus-visible:ring-blue-500 focus-visible:ring-offset-gray-900 border-0"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto h-5 w-5" />
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-4 border-t border-white/5 bg-black/50 flex justify-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[#657be8] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
