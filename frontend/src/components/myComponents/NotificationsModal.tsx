import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import {
  BellIcon, CheckCircle2Icon, Trash2Icon, TvIcon, MessageSquareIcon,
  ShieldAlertIcon, SparklesIcon, ExternalLinkIcon, GiftIcon, MedalIcon, XIcon
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '@/store/notificationStore';
import type { AppNotification, NotificationType } from '@/store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabId = 'all' | 'episode' | 'community' | 'system';

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'new_episode':
      return <TvIcon className="size-5 text-blue-400" />;
    case 'chat_mention':
      return <MessageSquareIcon className="size-5 text-purple-400" />;
    case 'badge_awarded':
      return <MedalIcon className="size-5 text-yellow-400" />;
    case 'donation_thanks':
      return <GiftIcon className="size-5 text-pink-400" />;
    case 'admin_message':
      return <ShieldAlertIcon className="size-5 text-orange-400" />;
    case 'system':
    default:
      return <SparklesIcon className="size-5 text-emerald-400" />;
  }
};

const formatTime = (dateStr: string) => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ro });
  } catch {
    return dateStr;
  }
};

export const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'episode') return n.type === 'new_episode';
    if (activeTab === 'community') return n.type === 'chat_mention';
    if (activeTab === 'system')
      return ['system', 'admin_message', 'donation_thanks', 'badge_awarded'].includes(n.type);
    return true;
  });

  const handleNotificationClick = (item: AppNotification) => {
    if (!item.is_read) markAsRead(item.id);
    if (item.action_url) {
      onOpenChange(false);
      navigate(item.action_url);
    }
  };

  const tabs = [
    { id: 'all' as TabId, label: 'Toate', count: notifications.length },
    { id: 'episode' as TabId, label: 'Episoade Noi', count: notifications.filter((n) => n.type === 'new_episode').length },
    { id: 'community' as TabId, label: 'Comunitate', count: notifications.filter((n) => n.type === 'chat_mention').length },
    {
      id: 'system' as TabId, label: 'Sistem & VIP',
      count: notifications.filter((n) => ['system', 'admin_message', 'donation_thanks', 'badge_awarded'].includes(n.type)).length,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[520px] max-w-[95vw] p-0 bg-[#ffffff03] backdrop-blur-[40px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[32px] overflow-hidden !outline-none [&>button]:hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] z-10" />

        <div className="absolute top-4 right-4 z-50">
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 border border-blue-500/30 text-blue-400 shadow-inner">
                <BellIcon className="size-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-[#0c0d12] animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-[#0c0d12]" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-white">
                  Centrul de Notificări
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-full">
                      {unreadCount} noi
                    </span>
                  )}
                </DialogTitle>
                <p className="text-xs text-neutral-400">Fii la curent cu noile episoade și activitatea din comunitate</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                  title="Marchează totul ca citit"
                >
                  <CheckCircle2Icon className="size-3.5 text-emerald-400" />
                  <span>Citite toate</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={deleteAllNotifications}
                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  title="Șterge toate notificările"
                >
                  <Trash2Icon className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-neutral-400'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[420px] overflow-y-auto px-6 pb-6 space-y-3 hide-scrollbar">
          {isLoading ? (
            <div className="py-12 text-center text-neutral-500 text-sm">Se încarcă...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="size-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-3 text-neutral-600">
                <BellIcon className="size-8" />
              </div>
              <p className="text-sm font-semibold text-neutral-400">Nicio notificare în această categorie</p>
              <p className="text-xs text-neutral-600 mt-1">Ești la zi cu tot! 🎉</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start ${
                  item.is_read
                    ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10 opacity-75 hover:opacity-100'
                    : 'bg-gradient-to-r from-blue-950/20 via-indigo-950/20 to-purple-950/10 border-blue-500/30 hover:border-blue-500/50 shadow-[0_4px_20px_rgba(37,99,235,0.08)]'
                }`}
                onClick={() => handleNotificationClick(item)}
              >
                {/* Unread dot */}
                {!item.is_read && (
                  <span className="absolute top-4 right-4 size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}

                {/* Icon / Image */}
                {item.image_url ? (
                  <div className="size-12 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-md">
                    <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="size-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    {getIcon(item.type)}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {item.title}
                    </h4>
                    {item.action_url && <ExternalLinkIcon className="size-3 text-neutral-500 group-hover:text-blue-400 transition-colors shrink-0" />}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">{item.message}</p>
                  <span className="inline-block mt-2 text-[11px] font-medium text-neutral-500">
                    {formatTime(item.created_at)}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(item.id); }}
                  className="absolute top-3 right-7 opacity-0 group-hover:opacity-100 p-1 text-neutral-600 hover:text-red-400 transition-all"
                  title="Șterge"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between mt-auto">
            <span className="text-xs text-neutral-500 font-medium">
              {unreadCount > 0 ? (
                <>Ai <strong className="text-white">{unreadCount}</strong> notificări necitite</>
              ) : (
                <span className="text-emerald-400 font-semibold">Toate citite ✓</span>
              )}
            </span>
            <button
              onClick={() => { onOpenChange(false); navigate('/settings'); }}
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Gestionează în Setări →
            </button>
          </div>
      </DialogContent>
    </Dialog>
  );
};
