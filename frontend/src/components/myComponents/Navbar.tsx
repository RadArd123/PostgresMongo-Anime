import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  BookmarkIcon,
  Clock3Icon,
  CompassIcon,
  HeartIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  UserRoundPenIcon,
  UserStarIcon,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useChatStore } from "@/store/chatStore";
import { useNavigate } from "react-router-dom";
import { SupportModal } from "./SupportModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [openSupport, setOpenSupport] = useState(false);

  const { logout, isLoading, error, isAdmin, isAuthenticated } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const { initSocket, disconnectSocket } = useChatStore();

  const handleLogout = async () => {
    try {
      await logout();
      if (!isLoading && !error) {
        navigate("/login");
      }
    } catch (err: any) {
      console.error("Logout error:", err);
    }
  };
  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [fetchProfile, isAuthenticated, profile]);

  // Initialize global socket for real-time notifications on all pages
  useEffect(() => {
    if (isAuthenticated) {
      initSocket();
    } else {
      disconnectSocket();
    }
  }, [disconnectSocket, initSocket, isAuthenticated]);

  const avatarSrc = profile?.avatar_url;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <SupportModal open={openSupport} onOpenChange={setOpenSupport} />
      <header className="fixed top-4 right-10  z-50 px-2 bg-neutral-900/70 backdrop-blur text-white shadow-md rounded-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            className="md:hidden  rounded-lg hover:bg-white/10 transition-colors w-5 h-5 flex items-center justify-center"
            aria-label="Toggle MenuIcon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="size-6" />
          </button>

   
          <nav className="hidden md:flex justify-end items-center gap-7">

            {/* Cool Button */}

            <div onClick={() => setOpenSupport(true)} className="group relative flex justify-center items-center text-white text-sm font-bold">
              <div className="shadow-md flex items-center group-hover:gap-2  bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/60  p-3 rounded-full cursor-pointer duration-300">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="20px"
                  width="20px"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-white"
                >
                  <path
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15.4306 7.70172C7.55045 7.99826 3.43929 15.232 2.17021 19.3956C2.07701 19.7014 2.31139 20 2.63107 20C2.82491 20 3.0008 19.8828 3.08334 19.7074C6.04179 13.4211 12.7066 12.3152 15.514 12.5639C15.7583 12.5856 15.9333 12.7956 15.9333 13.0409V15.1247C15.9333 15.5667 16.4648 15.7913 16.7818 15.4833L20.6976 11.6784C20.8723 11.5087 20.8993 11.2378 20.7615 11.037L16.8456 5.32965C16.5677 4.92457 15.9333 5.12126 15.9333 5.61253V7.19231C15.9333 7.46845 15.7065 7.69133 15.4306 7.70172Z"
                  ></path>
                </svg>
                <span className="text-[0px] group-hover:text-sm duration-300">
                  Susține-ne
                </span>
              </div>
            </div>

            {/* Cool Button */}
            <a
              href="/"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Acasă"
              title="Acasă"
            >
              <HomeIcon className="size=5" />
            </a>
            <a
              href="/browse"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Explorează"
              title="Explorează"
            >
              <CompassIcon className="size=5" />
            </a>

            <a
              href="/continue-watching"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Continuă Vizionarea"
              title="Continuă Vizionarea"
            >
              <Clock3Icon className="size=5" />
            </a>
            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="w-13 h-13 rounded-full overflow-hidden border-9 border-zinc-800 cursor-pointer">
                    <AvatarImage
                      src={avatarSrc}
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className="flex items-center justify-center bg-zinc-800">
                      <UserIcon className="size-6 text-zinc-400" />
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-48 rounded-xl border border-white/10 bg-[#111111cc] backdrop-blur-md p-2 shadow-xl font-semibold"
                >
                  <div className="flex flex-col text-sm text-white">
                    <a
                      href="/profile/edit"
                      className="flex w-full items-center rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <UserRoundPenIcon className="mr-2 h-4 w-4" />
                      Editează Profilul
                    </a>
                    <a
                      href="/watchlist"
                      className="flex w-full items-center rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <BookmarkIcon className="mr-2 h-4 w-4" />
                      Watchlist
                    </a>
                    <a
                      href="/favorites"
                      className="flex w-full items-center rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <HeartIcon className="mr-2 h-4 w-4" />
                      Favorite
                    </a>
                    {isAdmin && (
                      <a
                        href="/admin"
                        className="flex w-full items-center rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10 transition-colors"
                      >
                        <UserStarIcon className="mr-2 h-4 w-4" />
                        Admin Panel
                      </a>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center border-none rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Deconectare
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-bold text-white transition-all"
              >
                <LogInIcon className="size-4" />
                Autentificare
              </a>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
