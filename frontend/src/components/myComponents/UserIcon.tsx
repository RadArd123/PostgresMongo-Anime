import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserIconProps {
  username: string;
  avatarUrl?: string;
}

const UserIcon: React.FC<UserIconProps> = ({ username, avatarUrl }) => {
  // Build initials from username (e.g. "ShadowFox" → "S", "Sage Sensei" → "SS")
  const initials = username
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2)
    
  return (
    <Avatar className="inline-flex h-9 w-9 select-none items-center justify-center overflow-hidden rounded-full align-middle border border-slate-700 bg-slate-900">
      {avatarUrl && (
        <AvatarImage
          src={avatarUrl}
          alt={username}
          className="h-full w-full object-cover"
        />
      )}
      <AvatarFallback
        delayMs={200}
        className="flex h-full w-full items-center justify-center bg-slate-800 text-xs"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserIcon;
