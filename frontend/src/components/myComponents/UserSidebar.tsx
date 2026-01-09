
import { ScrollArea } from '../ui/scroll-area'
import  { useMemo, useState } from "react";
import UserIcon from './UserIcon';
import { Home } from 'lucide-react';

type UserRole = "user" | "admin";

interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  lastActive: string;
}
const users: User[] = [
  {
    id: 1,
    username: "ShadowFox",
    email: "shadow.fox@example.com",
    role: "admin",
    avatarUrl: "src/assets/avatars/avatar1.jpg",
    lastActive: "2 minutes ago",
  },
  {
    id: 2,
    username: "LunaHikari",
    email: "luna.hikari@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar2.jpg",
    lastActive: "12 minutes ago",
  },
  {
    id: 3,
    username: "OtakuKing",
    email: "otaku.king@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar3.jpg",
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    username: "SageSensei",
    email: "sage.sensei@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar4.jpg",
    lastActive: "3 hours ago",
  },
  {
    id: 5,
    username: "PixelNeko",
    email: "pixel.neko@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar5.jpg",
    lastActive: "Yesterday",
  },
  {
    id: 6,
    username: "AdminZero",
    email: "admin.zero@example.com",
    role: "admin",
    avatarUrl: "src/assets/avatars/avatar6.jpg",
    lastActive: "Now",
  },
   {
    id: 7,
    username: "ShadowFox",
    email: "shadow.fox@example.com",
    role: "admin",
    avatarUrl: "src/assets/avatars/avatar1.jpg",
    lastActive: "2 minutes ago",
  },
  {
    id: 8,
    username: "LunaHikari",
    email: "luna.hikari@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar2.jpg",
    lastActive: "12 minutes ago",
  },
  {
    id: 9,
    username: "OtakuKing",
    email: "otaku.king@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar3.jpg",
    lastActive: "1 hour ago",
  },
  {
    id: 10,
    username: "SageSensei",
    email: "sage.sensei@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar4.jpg",
    lastActive: "3 hours ago",
  },
  {
    id: 11,
    username: "PixelNeko",
    email: "pixel.neko@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar5.jpg",
    lastActive: "Yesterday",
  },
  {
    id: 12,
    username: "AdminZero",
    email: "admin.zero@example.com",
    role: "admin",
    avatarUrl: "src/assets/avatars/avatar6.jpg",
    lastActive: "Now",
  },
  {
    id: 13,
    username: "ShadowFox",
    email: "shadow.fox@example.com",
    role: "admin",
    avatarUrl: "src/assets/avatars/avatar1.jpg",
    lastActive: "2 minutes ago",
  },
  {
    id: 14,
    username: "LunaHikari",
    email: "luna.hikari@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar2.jpg",
    lastActive: "12 minutes ago",
  },
  {
    id: 15,
    username: "OtakuKing",
    email: "otaku.king@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar3.jpg",
    lastActive: "1 hour ago",
  },
  {
    id: 16,
    username: "SageSensei",
    email: "sage.sensei@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar4.jpg",
    lastActive: "3 hours ago",
  },
  {
    id: 17,
    username: "PixelNeko",
    email: "pixel.neko@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar5.jpg",
    lastActive: "Yesterday",
  },
  {
    id: 18,
    username: "AdminZero",
    email: "admin.zero@example.com",
    role: "admin",
    avatarUrl: "src/assets/avatars/avatar6.jpg",
    lastActive: "Now",
  },
   {
    id: 19,
    username: "ShadowFox",
    email: "shadow.fox@example.com",
    role: "admin",
    avatarUrl: "src/assets/avatars/avatar1.jpg",
    lastActive: "2 minutes ago",
  },
  {
    id: 20,
    username: "LunaHikari",
    email: "luna.hikari@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar2.jpg",
    lastActive: "12 minutes ago",
  },
  {
    id: 21,
    username: "OtakuKing",
    email: "otaku.king@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar3.jpg",
    lastActive: "1 hour ago",
  },
  {
    id: 22,
    username: "SageSensei",
    email: "sage.sensei@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar4.jpg",
    lastActive: "3 hours ago",
  },
  {
    id: 23,
    username: "PixelNeko",
    email: "pixel.neko@example.com",
    role: "user",
    avatarUrl: "src/assets/avatars/avatar5.jpg",
    lastActive: "Yesterday",
  },
  {
    id: 24,
    username: "AdminZero",
    email: "admin.zero@example.com",
    role: "admin",
    avatarUrl: "src/assets/avatars/avatar6.jpg",
    lastActive: "Now",
  },
];

const UserSidebar = () => {
     const [userSearch, setUserSearch] = useState("");

  // Memoized filtered user list (re-calculated only when search or users change)
  const filteredUsers = useMemo(() => {
    const query = userSearch.toLowerCase();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [userSearch]);

  return (
     <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-black top-0 left-0 h-screen fixed">
        {/* Logo / Brand */}
        <div className="h-16 flex items-center justify-around gap-2 text-lg font-bold border-b border-slate-800">
          🌀  Admin
          <a href="/" className="p-2 rounded hover:bg-slate-800 transition"><Home size={24} /></a>
        </div>

        {/* Sidebar content */}
        <nav className="flex-1 flex flex-col py-4">
          {/* Sidebar search for users only */}
          <div className="px-3 pb-3">
            <input
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:border-fuchsia-500"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          {/* Scrollable list of users using Radix ScrollArea */}
          <ScrollArea className="h-[80vh] px-1">
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-900/80 border border-transparent hover:border-slate-700 text-left transition"
                  >
                    <UserIcon username={user.username} avatarUrl={user.avatarUrl} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.username}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user.email}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {user.role === "admin" ? "Admin • " : "User • "}
                        {user.lastActive}
                      </p>
                    </div>
                  </button>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-[11px] text-slate-500 px-2">
                    No users match “{userSearch}”.
                  </p>
                )}
              </div>
          </ScrollArea>
        </nav>
      </aside>
  )
}

export default UserSidebar
