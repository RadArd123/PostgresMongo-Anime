import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/axios";
import type { AdminUser } from "./UserSidebar";
import UserIcon from "./UserIcon";
import { ShieldIcon, ShieldAlertIcon, Trash2Icon, SearchIcon, RefreshCwIcon, UserCheckIcon, MailIcon, ActivityIcon, CheckCircle2Icon, AlertTriangleIcon, TrophyIcon, FlameIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminUserDialogs from './AdminUserDialogs';
import { useAuthStore } from '@/store/authStore';

export const UserManagementTable: React.FC = () => {
  const currentUserId = useAuthStore(state => state.user?.id);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user" | "active">("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      if (res.data?.success && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Error fetching users for management table:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId: number, currentRole: string) => {
    setActionLoading(userId);
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/role`);
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u
          )
        );
        showToast(`User role successfully updated to ${currentRole === "admin" ? "USER" : "ADMIN"}!`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update user role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${username}"? This cannot be undone.`)) {
      return;
    }
    setActionLoading(userId);
    try {
      const res = await axiosInstance.delete(`/admin/users/${userId}`);
      if (res.data?.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showToast(`User "${username}" was deleted successfully.`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = users.filter((u) => {
      const matchesSearch =
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toString() === search;
      const matchesRole = roleFilter === "all" || roleFilter === "active" ? true : u.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    if (roleFilter === "active") {
      list = [...list].sort((a, b) => (b.activityScore || 0) - (a.activityScore || 0) || (b.totalVisits || 0) - (a.totalVisits || 0));
    }

    return list;
  }, [users, search, roleFilter]);

  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);

  return (
    <div className="space-y-6 relative">
      <AdminUserDialogs users={users} onSaved={fetchUsers} />
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 border border-emerald-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold"
          >
            <CheckCircle2Icon size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏆 Top Active Users Podium */}
      {users.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrophyIcon className="text-amber-400 size-5" />
              <span>Most Active Otakus (Leaderboard Podium)</span>
            </h3>
            <span className="text-xs text-gray-400 font-mono">Ranked by visits & database telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {users
              .slice()
              .sort((a, b) => (b.activityScore || 0) - (a.activityScore || 0) || (b.totalVisits || 0) - (a.totalVisits || 0))
              .slice(0, 3)
              .map((user, idx) => {
                const medals = ["👑 1st Gold", "🥈 2nd Silver", "🥉 3rd Bronze"];
                const borderColors = [
                  "border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-[#0D1117] to-[#0D1117] shadow-[0_0_25px_rgba(245,158,11,0.15)]",
                  "border-slate-400/40 bg-gradient-to-br from-slate-400/10 via-[#0D1117] to-[#0D1117]",
                  "border-amber-700/40 bg-gradient-to-br from-amber-700/10 via-[#0D1117] to-[#0D1117]",
                ];
                const badgeColors = [
                  "bg-amber-500/20 text-amber-300 border-amber-500/40",
                  "bg-slate-400/20 text-slate-300 border-slate-400/40",
                  "bg-amber-700/20 text-amber-400 border-amber-700/40",
                ];

                return (
                  <motion.div
                    key={user.id}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl p-5 border ${borderColors[idx] || "border-[#21262d] bg-[#0D1117]"} flex flex-col justify-between space-y-4 relative overflow-hidden`}
                  >
                    {/* Rank Ribbon */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${badgeColors[idx]}`}>
                        {medals[idx]}
                      </span>
                      <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                        <FlameIcon className="text-orange-400 size-3.5 fill-orange-400" />
                        <b className="text-white">{user.totalVisits || 0}</b> visits
                      </span>
                    </div>

                    {/* User Profile Info */}
                    <div className="flex items-center gap-3">
                      <UserIcon username={user.username} avatarUrl={user.avatarUrl} />
                      <div>
                        <h4 className="font-bold text-white text-base truncate flex items-center gap-1.5">
                          <span>{user.username}</span>
                          {user.role === "admin" && <ShieldIcon className="size-3.5 text-purple-400 fill-purple-400" />}
                        </h4>
                        <p className="text-xs text-gray-400 italic truncate max-w-[180px]">
                          "{user.status || "Otaku"}"
                        </p>
                      </div>
                    </div>

                    {/* Telemetry Pills */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center font-mono text-[11px]">
                      <div className="bg-[#161b22] py-1 rounded-lg border border-white/5">
                        <span className="text-gray-500 block text-[9px]">SCORE</span>
                        <b className="text-orange-400">{user.activityScore || 0}</b>
                      </div>
                      <div className="bg-[#161b22] py-1 rounded-lg border border-white/5">
                        <span className="text-gray-500 block text-[9px]">FAVS</span>
                        <b className="text-red-400">{user.favoritesCount || 0}</b>
                      </div>
                      <div className="bg-[#161b22] py-1 rounded-lg border border-white/5">
                        <span className="text-gray-500 block text-[9px]">WATCHLIST</span>
                        <b className="text-blue-400">{user.watchlistCount || 0}</b>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#21262d] pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "Righteous, cursive" }}>
              <UserCheckIcon className="text-blue-400 size-5" />
              <span>User & Role Directory</span>
            </h3>
            <p className="text-xs text-gray-400">
              View registered users, inspect telemetry status, and promote accounts to Administrator role.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#21262d] text-xs font-mono text-gray-400 flex items-center gap-2">
              <span>Total: <b className="text-white">{users.length}</b></span>
              <span>•</span>
              <span className="text-purple-400 flex items-center gap-1"><ShieldIcon size={12} /> Admins: <b>{adminCount}</b></span>
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-gray-400 hover:text-white transition-colors"
              title="Refresh User Table"
            >
              <RefreshCwIcon size={16} className={loading ? "animate-spin text-blue-400" : ""} />
            </button>
          </div>
        </div>

        {/* Filters & SearchIcon */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <SearchIcon size={16} className="absolute left-3.5 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="SearchIcon by ID, username, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161b22] border border-[#21262d] text-xs text-white placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
            {[
              { id: "all", label: `All (${users.length})` },
              { id: "active", label: `🔥 Most Active` },
              { id: "admin", label: `Admins (${adminCount})` },
              { id: "user", label: `Regular Users (${users.length - adminCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  roleFilter === tab.id
                    ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-md"
                    : "bg-[#161b22] border-[#21262d] text-gray-400 hover:text-white hover:bg-[#21262d]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cyberwiz Users Table */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCwIcon size={28} className="animate-spin mx-auto text-blue-500" />
            <p className="text-sm text-gray-400 font-medium">Loading user database telemetry...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-2 text-gray-500">
            <AlertTriangleIcon size={32} className="mx-auto text-amber-500/50" />
            <p className="text-sm font-semibold text-gray-400">No users match criteria</p>
            <p className="text-xs">Try adjusting your search query or role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#161b22] border-b border-[#21262d] text-gray-400 text-xs font-mono uppercase tracking-wider">
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role Status</th>
                  <th className="py-4 px-6">ActivityIcon Stats</th>
                  <th className="py-4 px-6">Last Active</th>
                  <th className="py-4 px-6 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d] text-sm">
                {filteredUsers.map((user) => {
                  const isAdminUser = user.role === "admin";
                  const isProcessing = actionLoading === user.id;

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[#161b22]/50 transition-colors group"
                    >
                      {/* User Account */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <UserIcon username={user.username} avatarUrl={user.avatarUrl} />
                            {isAdminUser && (
                              <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-purple-600 border border-[#0d1117] flex items-center justify-center text-white" title="Admin">
                                <ShieldIcon size={10} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{user.username}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#21262d] text-gray-400 border border-[#30363d]">
                                #{user.id}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-500 font-mono">
                              Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="py-4 px-6 whitespace-nowrap text-gray-300 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <MailIcon size={14} className="text-gray-500" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Role Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {isAdminUser ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                            <ShieldIcon size={12} className="fill-purple-400" /> Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium uppercase tracking-wider">
                            Regular User
                          </span>
                        )}
                      </td>

                      {/* ActivityIcon Stats */}
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold" title="Total App Visits">
                            <FlameIcon size={12} className="fill-orange-400" />
                            <span>{user.totalVisits || 0} visits</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400" title="Favorites Count">
                            <span>❤️ {user.favoritesCount || 0}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400" title="Watchlist Count">
                            <span>🔖 {user.watchlistCount || 0}</span>
                          </span>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-6 whitespace-nowrap text-gray-400 text-xs font-mono">
                        <div className="flex items-center gap-1.5">
                          <ActivityIcon size={14} className="text-emerald-400" />
                          <span>{user.lastActive || "Today"}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleRole(user.id, user.role)}
                            disabled={isProcessing || user.id === currentUserId}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                              isAdminUser
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                                : "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                            }`}
                            title={isAdminUser ? "Demote to regular user" : "Promote to Administrator"}
                          >
                            <ShieldAlertIcon size={14} />
                            <span>{isProcessing ? "Updating..." : isAdminUser ? "Demote Admin" : "Make Admin"}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            disabled={isProcessing || user.id === currentUserId}
                            aria-label={`Delete ${user.username}`}
                            className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
                            title="Delete User Account"
                          >
                            <Trash2Icon size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementTable;
