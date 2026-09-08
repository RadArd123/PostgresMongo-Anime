import { lazy, Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HeartIcon, BookmarkIcon, CompassIcon, BellIcon, UserIcon,
  ChevronLeftIcon, ChevronRightIcon, LogOutIcon, LogInIcon, CoffeeIcon, VideoIcon, MessageSquareIcon, Tv2Icon, UserRoundPenIcon, UserStarIcon
} from "lucide-react";
import { HomeIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useContinueWatchingStore } from "@/store/continueWatchingStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationsModal = lazy(() =>
  import("./NotificationsModal").then((module) => ({ default: module.NotificationsModal }))
);
const SupportModal = lazy(() =>
  import("./SupportModal").then((module) => ({ default: module.SupportModal }))
);

type AnimeSidebarProps = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  loading?: boolean;
};


// ──────────────────────────────────────────────────────────────────────────────
// Top Profile Section (with Popover)
// ──────────────────────────────────────────────────────────────────────────────
const ProfileHeader = ({ collapsed }: { collapsed?: boolean }) => {
  const { user, isAdmin, isAuthenticated, logout, isLoading, error } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const navigate = useNavigate();
  const userName = profile?.username || user?.username || "Radu";
  const userStatus = profile?.status || "I love Anime";

  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [fetchProfile, isAuthenticated, profile]);

  const avatarSrc = profile?.avatar_url;

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

  return (
    <div className="flex items-center gap-3 p-4 pt-6 group-data-[collapsed=true]/sidebar:justify-center transition-all relative">
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative shrink-0 cursor-pointer hover:scale-105 transition-transform">
            <div className="size-10 md:size-12 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Avatar className="w-full h-full">
                <AvatarImage src={avatarSrc} className="object-cover" />
                <AvatarFallback className="bg-indigo-500/20 flex items-center justify-center">
                  <UserIcon className="size-6 text-indigo-300" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute top-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-48 rounded-xl border border-white/10 bg-[#111111cc] backdrop-blur-md p-2 shadow-xl font-semibold z-50"
        >
          <div className="flex flex-col text-sm text-white">
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate("/profile")} className="flex w-full items-center rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10 transition-colors">
                  <UserRoundPenIcon className="mr-2 h-4 w-4" /> Profilul Meu
                </button>
                {isAdmin && (
                  <button onClick={() => navigate("/admin")} className="flex w-full items-center rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10 transition-colors text-blue-400">
                    <UserStarIcon className="mr-2 h-4 w-4" /> Admin Panel
                  </button>
                )}
                <button onClick={handleLogout} className="flex w-full items-center border-none rounded-lg px-3 py-2 hover:bg-red-500/20 text-red-400 transition-colors mt-1">
                  <LogOutIcon className="mr-2 h-4 w-4" /> Deconectare
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/login")} className="flex w-full items-center rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10 transition-colors">
                <LogInIcon className="mr-2 h-4 w-4" /> Conectare
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {!collapsed && (
        <div className="flex flex-col min-w-0 transition-opacity duration-300">
          <span className="text-sm md:text-base font-bold text-white truncate">{userName}</span>
          <span className="text-[11px] text-indigo-400 font-medium tracking-wide truncate" title={userStatus}>{userStatus}</span>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Menu Navigation Section
// ──────────────────────────────────────────────────────────────────────────────
const NavigationMenu = ({ collapsed }: { collapsed?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Acasă", icon: HomeIcon, path: "/" },
    { name: "Explorează", icon: CompassIcon, path: "/browse" },
    { name: "Favorite", icon: HeartIcon, path: "/favorites" },
    { name: "Watchlist", icon: BookmarkIcon, path: "/watchlist" },
  ];

  return (
    <div className="px-3 py-4 space-y-1">
      {!collapsed && <p className="px-3 text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Meniu</p>}
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 ${isActive
                ? "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center px-0" : ""}`}
            title={item.name}
          >
            <item.icon className={`size-5 shrink-0 ${isActive ? "text-white" : ""}`} />
            {!collapsed && <span className="text-sm font-semibold truncate">{item.name}</span>}
          </button>
        );
      })}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Inner Glass Card (Continue Watching)
// ──────────────────────────────────────────────────────────────────────────────
const ContinueWatchingCard = ({ collapsed, loading }: { collapsed?: boolean, loading?: boolean }) => {
  const navigate = useNavigate();
  const { items, isLoading, fetchContinueWatching } = useContinueWatchingStore();

  useEffect(() => {
    fetchContinueWatching();
  }, [fetchContinueWatching]);

  if (collapsed) {
    return (
      <div className="px-3 mt-2 flex flex-col gap-3 items-center">
        {items.slice(0, 2).map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/anime/episode/${item.episode_id}`)}
            className="size-10 rounded-full overflow-hidden border border-white/10 relative group cursor-pointer hover:border-blue-500 transition-colors"
            title={`${item.anime_title} - Ep. ${item.episode_number}`}
          >
            <img
              src={item.img_url_icon || item.img_url_banner || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop"}
              alt={item.anime_title || "Anime"}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <button onClick={() => navigate("/continue-watching")} className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white" title="All History">
          <Tv2Icon className="size-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 mt-2">
      <p className="px-1 text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Continuă Vizionarea</p>
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-[24px] p-2 shadow-inner">
        <div className="max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="space-y-1">
            {loading || isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <li key={idx} className="flex items-center gap-3 p-2 rounded-xl">
                  <Skeleton className="size-10 rounded-xl bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4 bg-white/10" />
                    <Skeleton className="h-2 w-1/2 bg-white/10" />
                  </div>
                </li>
              ))
            ) : items && items.length > 0 ? (
              items.slice(0, 3).map((item) => {
                const progressPercent = Math.min(100, Math.round((item.progress_seconds / item.duration_seconds) * 100)) || 20;
                return (
                  <li
                    key={item.id}
                    onClick={() => navigate(`/anime/episode/${item.episode_id}`)}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.06] transition-all cursor-pointer group/item"
                  >
                    <div className="size-10 shrink-0 overflow-hidden rounded-[10px] bg-neutral-800 shadow-md group-hover/item:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-shadow relative">
                      <img
                        src={item.img_url_icon || item.img_url_banner || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop"}
                        alt={item.anime_title || "Anime"}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                        <div className="h-full bg-blue-500" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-neutral-200 truncate group-hover/item:text-blue-400 transition-colors">
                        {item.anime_title || "Anime Series"}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate mt-0.5 flex items-center gap-1">
                        <VideoIcon size={10} className="text-blue-400" />
                        <span>Ep. {item.episode_number}</span>
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="p-2 text-center text-xs text-gray-500">Niciun episod neterminat</li>
            )}
            <li onClick={() => navigate("/continue-watching")} className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.06] transition-all cursor-pointer text-gray-400 hover:text-white mt-1">
              <div className="size-10 shrink-0 rounded-[10px] border border-dashed border-white/20 flex items-center justify-center">
                <Tv2Icon className="size-4" />
              </div>
              <span className="text-xs font-semibold">Vezi tot istoricul</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Bottom Action / Settings
// ──────────────────────────────────────────────────────────────────────────────
const BottomActions = ({ collapsed }: { collapsed?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isChatActive = location.pathname === "/chat";
  const [openSupport, setOpenSupport] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  return (
    <div className="mt-auto p-4 flex flex-col gap-3">
      <Suspense fallback={null}>
        {openNotifications && (
          <NotificationsModal open={openNotifications} onOpenChange={setOpenNotifications} />
        )}
        {openSupport && <SupportModal open={openSupport} onOpenChange={setOpenSupport} />}
      </Suspense>

      {/* Settings Row */}
      <div className={`flex items-center ${collapsed ? "justify-center flex-col gap-3" : "justify-between bg-white/[0.03] border border-white/[0.05] rounded-2xl p-2 px-4 shadow-inner"}`}>
        <button onClick={() => setOpenSupport(true)} className="text-gray-400 hover:text-white transition-colors relative group" title="Support">
          <CoffeeIcon className="size-5 group-hover:text-amber-500 transition-colors" />
        </button>
        <button onClick={() => setOpenNotifications(true)} className="text-gray-400 hover:text-white transition-colors relative" title="Notifications">
          <BellIcon className="size-5" />
          <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full border border-[#0a0a0a]" />
        </button>
        <button onClick={() => navigate("/profile")} className="text-gray-400 hover:text-white transition-colors" title="Profile">
          <UserIcon className="size-5" />
        </button>
      </div>

      {/* Live Chat Button */}
      <button
        onClick={() => navigate("/chat")}
        className={`w-full transition-all flex items-center justify-center gap-2 ${collapsed ? "size-12 rounded-full mx-auto" : "py-4 rounded-2xl font-bold"} ${
          isChatActive
            ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            : "bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        }`}
      >
        <MessageSquareIcon className="size-5 shrink-0" />
        {!collapsed && <span>Live Chat</span>}
      </button>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Main sidebar wrapper (The sleek glassmorphism capsule)
// ──────────────────────────────────────────────────────────────────────────────
const AnimeSidebar = ({ collapsed, setCollapsed, loading = false }: AnimeSidebarProps) => {
  return (
    // The wrapper creates the margin around the sidebar to make it "float"
    <div className="h-full py-4 pl-4 pr-2 relative group/sidebar">

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-50 bg-neutral-800 border border-white/10 rounded-full p-1.5 shadow-xl text-white hover:bg-neutral-700 transition-colors"
      >
        {collapsed ? <ChevronRightIcon className="size-4" /> : <ChevronLeftIcon className="size-4" />}
      </button>

      <aside
        data-collapsed={collapsed}
        className={[
          "relative flex flex-col h-full",
          // Extremely sleek glassmorphism background
          "bg-[#ffffff03] backdrop-blur-[40px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "w-full transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          // Ultra rounded capsule aesthetic
          collapsed ? "rounded-[40px]" : "rounded-[32px]",
          "overflow-hidden",
        ].join(" ")}
      >
        {/* Hide scrollbar on the main area too */}
        <div className="h-full w-full flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-col min-h-[calc(100vh-32px)]">
            <ProfileHeader collapsed={collapsed} />
            <NavigationMenu collapsed={collapsed} />
            <ContinueWatchingCard collapsed={collapsed} loading={loading} />
            <BottomActions collapsed={collapsed} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AnimeSidebar;
