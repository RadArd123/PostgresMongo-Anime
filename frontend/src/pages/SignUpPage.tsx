import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimeFightBackground from "@/components/myComponents/AnimeFightBackground";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, error: authError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu se potrivesc");
      setIsLoading(false);
      return;
    }

    // Call zustand signup function
    await signup(formData.username, formData.email, formData.password);
    
    // Check if authentication was successful
    if (useAuthStore.getState().isAuthenticated) {
      navigate("/");
    } else {
      setIsLoading(false);
    }
  };

  const displayError = error || authError;

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#02040a]">
      {/* Background Anime Grid Matrix */}
      <AnimeFightBackground />

      {/* Center Cyberpunk Console Form (No outer box/border, floating free) */}
      <div className="relative z-30 w-full max-w-md px-6 my-8 animate-in zoom-in-95 duration-500">
        <div className="relative z-10 w-full">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl text-zinc-100 leading-tight tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
              Creează-ți{" "}
              <span className="text-white font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                Avatarul
              </span>
              <br />
              <span className="text-zinc-400 font-light text-base md:text-lg tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                pentru a te alătura Ghildei
              </span>
            </h1>
          </div>

          <form className="space-y-4" onSubmit={handleSignup} autoComplete="off">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Alege Numele Avatarului (Utilizator)"
                className="w-full bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              
              <input
                type="password"
                placeholder="Creează Parola de Acces"
                className="w-full bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />

              <input
                type="password"
                placeholder="Confirmă Parola"
                className="w-full bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                name="confirmPassword"
                value={formData.confirmPassword}
                autoComplete="new-password"
                onChange={handleChange}
              />
            </div>

            {displayError && (
              <div className="text-red-400 text-[10px] uppercase tracking-widest text-center animate-pulse drop-shadow-md">
                Alertă Sistem: {displayError}
              </div>
            )}

            <div className="flex justify-center pt-2">
              <p className="text-[11px] text-zinc-400 font-medium tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Ai deja un cont?{" "}
                <Link
                  to="/login"
                  className="text-zinc-100 hover:text-white underline underline-offset-4 transition-all ml-1 font-bold"
                >
                  Intră în Realm-ul tău
                </Link>
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group mt-6 bg-white hover:bg-zinc-200 disabled:bg-zinc-500 border border-white/20 rounded-2xl py-2 pl-8 pr-2 flex items-center justify-between transition-all active:scale-[0.98] shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
            >
              <span className="text-black font-black tracking-tighter uppercase text-sm">
                {isLoading ? "Se sincronizează..." : "Finalizează Înregistrarea"}
              </span>
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <span className="text-white text-xl">→</span>
              </div>
            </button>
          </form>

          <p className="mt-10 text-[10px] text-zinc-500 text-center leading-relaxed font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Înregistrându-te, îți inițializezi conexiunea la{" "}
            <span onClick={() => toast.info('📜 Disponibil în curând în versiunea finală.')} className="text-zinc-300 underline cursor-pointer hover:text-white transition-colors">
              Protocoalele Ghildei
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
