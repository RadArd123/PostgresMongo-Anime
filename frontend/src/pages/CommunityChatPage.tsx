import { useEffect, useState, useRef, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore, type ChatMessage } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useAnimeStore } from "@/store/animeStore";
import {
  MessageSquare, Send, Sparkles, Trash2, Crown, Star,
  Plus, X, ExternalLink, Hash, ArrowLeft
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import defaultAvatar from "@/assets/zoro.jpg";

const CommunityChatPage = () => {
  const navigate = useNavigate();
  const { messages, isLoading, isConnected, initSocket, disconnectSocket, fetchMessages, sendMessage, deleteMessage } = useChatStore();
  const { user } = useAuthStore();
  const { animes, fetchAnimes } = useAnimeStore();

  const [inputMsg, setInputMsg] = useState("");
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [searchAnimeQuery, setSearchAnimeQuery] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchAnimes();
    initSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputMsg.trim() && !selectedAnimeId) return;
    setIsSending(true);
    try {
      await sendMessage(inputMsg.trim() || "Check out this anime recommendation!", selectedAnimeId);
      setInputMsg("");
      setSelectedAnimeId(null);
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedAnimeObj = animes?.find((a) => a.id === selectedAnimeId);
  const filteredAnimes = animes?.filter((a) =>
    a.title.toLowerCase().includes(searchAnimeQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen w-full bg-[#0b0c10] text-slate-100 pl-[80px] md:pl-[120px] pr-4 md:pr-10 py-6 flex flex-col items-center">
      <div className="w-full max-w-6xl h-[calc(100vh-3rem)] rounded-3xl bg-[#11131a] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Chat Channel Header */}
        <div className="px-6 py-4 bg-[#161822]/90 border-b border-white/10 flex items-center justify-between shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Hash size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-wide">general-community</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Live Chat
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span className={`inline-block size-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
                <span>{isConnected ? "Real-time WebSocket connected" : "Connecting live feed..."}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all"
            >
              <ArrowLeft size={16} /> Exit Chat
            </button>
          </div>
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {isLoading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 text-gray-500">
              <div className="size-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading community messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4 max-w-md mx-auto">
              <div className="size-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">No messages yet!</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Welcome to the global anime lounge! Be the first to start the conversation or recommend your favorite series.
              </p>
            </div>
          ) : (
            messages.map((msg: ChatMessage) => {
              const isMe = user && user.id === msg.user_id;
              const canDelete = isMe || (user && user.is_admin);
              const isAdminMsg = msg.role === "admin";

              return (
                <div
                  key={msg.id}
                  className={`flex gap-4 group/msg transition-all ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* User Avatar */}
                  <Avatar className="size-10 rounded-2xl shrink-0 border border-white/10 shadow-md">
                    <AvatarImage src={msg.avatar_url || defaultAvatar} alt={msg.username || "User"} className="object-cover" />
                    <AvatarFallback className="bg-neutral-800 text-xs font-bold text-blue-400">
                      {msg.username?.slice(0, 2).toUpperCase() || "AN"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Bubble & Content */}
                  <div className={`max-w-[75%] sm:max-w-[60%] space-y-1 ${isMe ? "items-end text-right" : "items-start text-left"}`}>
                    
                    {/* Name & Time Header */}
                    <div className={`flex items-center gap-2 text-xs ${isMe ? "justify-end" : "justify-start"}`}>
                      <span className={`font-black ${isAdminMsg ? "text-amber-400 flex items-center gap-1" : "text-gray-200"}`}>
                        {msg.username || `User #${msg.user_id}`}
                        {isAdminMsg && <Crown size={12} className="fill-amber-400" />}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {canDelete && (
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover/msg:opacity-100 text-gray-500 hover:text-red-400 transition-all p-0.5"
                          title="Delete message"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    {/* Text Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg break-words ${
                        isMe
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                          : "bg-[#1c1f2e] border border-white/10 text-gray-100 rounded-tl-sm"
                      }`}
                    >
                      {msg.message}
                    </div>

                    {/* Rich Embedded Anime Recommendation Card */}
                    {msg.anime_id && (
                      <div className={`mt-2 p-3 rounded-2xl bg-[#141620] border border-white/15 shadow-xl flex items-center gap-3 w-72 sm:w-80 text-left transition-transform hover:scale-[1.02] cursor-pointer group/card ${isMe ? "ml-auto" : "mr-auto"}`}
                           onClick={() => navigate(`/anime/${msg.anime_id}`)}>
                        <div className="size-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 relative">
                          <img
                            src={msg.img_url_icon || msg.img_url_banner || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop"}
                            alt={msg.anime_title || "Anime"}
                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                            <Sparkles size={11} /> Recommended Anime
                          </div>
                          <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover/card:text-blue-400 transition-colors">
                            {msg.anime_title || `Anime #${msg.anime_id}`}
                          </h4>
                          {msg.rating && (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 mt-1">
                              <Star size={11} className="fill-amber-400" />
                              <span>{msg.rating} / 10</span>
                            </div>
                          )}
                        </div>
                        <div className="size-8 rounded-full bg-blue-500/10 text-blue-400 group-hover/card:bg-blue-500 group-hover/card:text-white flex items-center justify-center transition-all shrink-0">
                          <ExternalLink size={14} />
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input & Recommendation Bar */}
        <div className="p-4 sm:p-6 bg-[#161822]/90 border-t border-white/10 shrink-0 space-y-3 backdrop-blur-md">
          
          {/* Selected Anime Preview Tag */}
          {selectedAnimeObj && (
            <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-xl bg-blue-950/40 border border-blue-500/40 text-xs font-bold text-blue-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 truncate">
                <Sparkles size={14} className="text-blue-400 shrink-0" />
                <span className="truncate">Attaching Recommendation: <span className="text-white font-extrabold">{selectedAnimeObj.title}</span></span>
              </div>
              <button
                onClick={() => setSelectedAnimeId(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Remove attachment"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            {/* Recommend Anime Button */}
            <button
              onClick={() => setIsRecommendModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 text-gray-300 hover:text-blue-400 font-bold text-xs flex items-center gap-2 transition-all shrink-0 shadow-sm"
              title="Recommend an anime in your chat message"
            >
              <Plus size={16} className="text-blue-400" />
              <span className="hidden sm:inline">Recommend Anime</span>
            </button>

            {/* Textarea Input */}
            <textarea
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message in #general-community... (Enter to send)"
              rows={1}
              className="flex-1 px-5 py-3 rounded-2xl bg-[#0b0c10] border border-white/15 focus:border-blue-500 text-sm text-white placeholder-gray-500 focus:outline-none resize-none max-h-24 shadow-inner"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isSending || (!inputMsg.trim() && !selectedAnimeId)}
              className="size-12 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 border border-blue-400 disabled:border-white/10 text-white flex items-center justify-center transition-all shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:shadow-none hover:scale-105 active:scale-95"
            >
              {isSending ? (
                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} className="translate-x-0.5" />
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Recommend Anime Popup Modal */}
      <Dialog open={isRecommendModalOpen} onOpenChange={setIsRecommendModalOpen}>
        <DialogContent className="bg-[#11131a] border border-white/15 text-white max-w-lg rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
              <Sparkles className="text-blue-500" /> Select an Anime to Recommend
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <input
              type="text"
              placeholder="Search anime title..."
              value={searchAnimeQuery}
              onChange={(e) => setSearchAnimeQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10">
              {filteredAnimes.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-6">No anime found</p>
              ) : (
                filteredAnimes.map((anime) => (
                  <div
                    key={anime.id}
                    onClick={() => {
                      setSelectedAnimeId(anime.id);
                      setIsRecommendModalOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group ${
                      selectedAnimeId === anime.id
                        ? "bg-blue-600/20 border-blue-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={anime.img_url_icon || anime.img_url_banner}
                        alt={anime.title}
                        className="size-10 rounded-xl object-cover bg-neutral-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                          {anime.title}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-400 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      Attach
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityChatPage;
