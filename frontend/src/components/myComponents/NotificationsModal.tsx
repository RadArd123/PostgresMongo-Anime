import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Bell, CheckCircle2, Trash2, Tv, MessageSquare, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'episode' | 'community' | 'system' | 'vip';
  read: boolean;
  link?: string;
  image?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Episod Nou Disponibil!',
    message: 'Solo Leveling S2 - Episodul 08 este acum online la calitate 1080p Subtitrat.',
    time: 'Acum 10 minute',
    type: 'episode',
    read: false,
    link: '/browse',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    title: 'Mențiune în Live Chat 💬',
    message: 'OtakuKing42 a răspuns la mesajul tău din camera #general-chat: "Băi, ultimul episod a fost genial!"',
    time: 'Acum 2 ore',
    type: 'community',
    read: false,
    link: '/chat',
  },
  {
    id: '3',
    title: 'Bine ai venit pe RadAnime VIP! ✨',
    message: 'Datorită susținerii tale, contul tău beneficiază acum de streaming fără reclame și viteză turbo!',
    time: 'Ieri',
    type: 'vip',
    read: true,
  },
  {
    id: '4',
    title: 'Actualizare Sistem & Servere 🚀',
    message: 'Am adăugat 50+ anime-uri noi în catalogul de primăvară și am optimizat playerul video.',
    time: 'Acum 3 zile',
    type: 'system',
    read: true,
  },
];

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'episode' | 'community' | 'system'>('all');
  const { notifications: notifSettings } = useSettingsStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (n.type === 'episode' && !notifSettings.newEpisodes) return false;
    if (n.type === 'community' && !notifSettings.communityMentions) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'system') return n.type === 'system' || n.type === 'vip';
    return n.type === activeTab;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    if (item.link) {
      onOpenChange(false);
      navigate(item.link);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'episode':
        return <Tv className="size-5 text-blue-400" />;
      case 'community':
        return <MessageSquare className="size-5 text-indigo-400" />;
      case 'vip':
        return <Sparkles className="size-5 text-amber-400 animate-pulse" />;
      case 'system':
      default:
        return <ShieldAlert className="size-5 text-emerald-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white">
        {/* Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />

        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 border border-blue-500/30 text-blue-400 shadow-inner">
                <Bell className="size-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-[#0c0d12] animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-[#0c0d12]" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
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
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Citite toate</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  title="Șterge toate notificările"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-x-auto hide-scrollbar">
            {[
              { id: 'all', label: 'Toate', count: notifications.length },
              { id: 'episode', label: 'Episoade Noi', count: notifications.filter((n) => n.type === 'episode').length },
              { id: 'community', label: 'Comunitate', count: notifications.filter((n) => n.type === 'community').length },
              { id: 'system', label: 'Sistem & VIP', count: notifications.filter((n) => n.type === 'system' || n.type === 'vip').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="size-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-3 text-neutral-600">
                <Bell className="size-8" />
              </div>
              <p className="text-sm font-semibold text-neutral-400">Nicio notificare în această categorie</p>
              <p className="text-xs text-neutral-600 mt-1">Ești cu toate episoadele la zi! 🍿</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start ${
                  item.read
                    ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10 opacity-75 hover:opacity-100'
                    : 'bg-gradient-to-r from-blue-950/20 via-indigo-950/20 to-purple-950/10 border-blue-500/30 hover:border-blue-500/50 shadow-[0_4px_20px_rgba(37,99,235,0.08)]'
                }`}
              >
                {/* Unread dot indicator */}
                {!item.read && (
                  <span className="absolute top-4 right-4 size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}

                {/* Left Icon or Image */}
                {item.image ? (
                  <div className="size-12 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-md relative">
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                    {item.link && <ExternalLink className="size-3 text-neutral-500 group-hover:text-blue-400 transition-colors shrink-0" />}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                    {item.message}
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-medium text-neutral-500">
                    {item.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
          <span>Notificări Episoade Noi: <strong className="text-neutral-300">{notifSettings.newEpisodes ? 'Activat' : 'Oprit'}</strong></span>
          <button
            onClick={() => {
              onOpenChange(false);
              navigate('/settings');
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors"
          >
            Gestionează în Setări &rarr;
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
