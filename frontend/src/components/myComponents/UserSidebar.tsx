import React, { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import UserIcon from "./UserIcon";
import { HomeIcon, ShieldIcon, UserIcon as UserIconLucide, RefreshCwIcon, SearchIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  avatarUrl: string;
  status?: string;
  lastActive: string;
  createdAt?: string;
  totalVisits?: number;
  activeDays?: number;
  favoritesCount?: number;
  watchlistCount?: number;
  activityScore?: number;
}

interface UserSidebarProps {
  onSelectUser?: (user: AdminUser) => void;
  selectedUserId?: number;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ onSelectUser, selectedUserId }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      if (res.data?.success && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Error fetching admin users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Memoized filtered user list
  const filteredUsers = useMemo(() => {
    const query = userSearch.toLowerCase().trim();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [users, userSearch]);

  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[#21262d] bg-[#0d1117] top-0 left-0 h-screen fixed z-30 shadow-2xl">
      {/* Logo / Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#21262d] bg-[#010409]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌀</span>
          <span className="font-black text-white text-base tracking-wide" style={{ fontFamily: "Righteous, cursive" }}>
            Admin Portal
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={fetchUsers}
            title="Refresh Users"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#161b22] transition-colors"
          >
            <RefreshCwIcon size={14} className={loading ? "animate-spin text-blue-400" : ""} />
          </button>
          <a
            href="/"
            title="Back to HomeIcon"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#161b22] transition-colors"
          >
            <HomeIcon size={16} />
          </a>
        </div>
      </div>

      {/* User Stats Bar */}
      <div className="px-4 py-2.5 bg-[#161b22]/50 border-b border-[#21262d] flex items-center justify-between text-xs font-mono text-gray-400">
        <span>Total: <b className="text-white">{users.length}</b></span>
        <span className="flex items-center gap-1 text-purple-400">
          <ShieldIcon size={12} /> Admins: <b>{adminCount}</b>
        </span>
      </div>

      {/* Sidebar Content */}
      <nav className="flex-1 flex flex-col pt-3 overflow-hidden">
        {/* SearchIcon input */}
        <div className="px-3 pb-3">
          <div className="relative">
            <SearchIcon size={14} className="absolute left-3 top-2.5 text-gray-500" />
            <input
              className="w-full rounded-xl bg-[#161b22] border border-[#21262d] pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="SearchIcon users by name/email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable User List */}
        <ScrollArea className="flex-1 px-2 pb-4">
          {loading && users.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500 space-y-2">
              <RefreshCwIcon size={20} className="animate-spin mx-auto text-blue-500" />
              <p>Loading DB users...</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => {
                const isSelected = selectedUserId === user.id;
                const isAdminUser = user.role === "admin";

                return (
                  <button
                    key={user.id}
                    onClick={() => onSelectUser?.(user)}
                    className={`w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all group ${
                      isSelected
                        ? "bg-blue-600/20 border border-blue-500/50 text-white shadow-md"
                        : "hover:bg-[#161b22] border border-transparent hover:border-[#21262d] text-gray-300"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <UserIcon username={user.username} avatarUrl={user.avatarUrl} />
                      {isAdminUser && (
                        <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-purple-600 border border-[#0d1117] flex items-center justify-center text-white shadow" title="Admin">
                          <ShieldIcon size={10} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${isAdminUser ? "text-purple-300" : "text-white"}`}>
                          {user.username}
                        </p>
                        {isAdminUser ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-mono border border-purple-500/30 uppercase">
                            Admin
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-mono uppercase">
                            User
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {user.email}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5 font-mono">
                        Active: {user.lastActive}
                      </p>
                    </div>
                  </button>
                );
              })}

              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500 text-xs px-4">
                  <UserIconLucide size={24} className="mx-auto mb-2 opacity-30" />
                  No users matching "{userSearch}" found.
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </nav>
    </aside>
  );
};

export default UserSidebar;
