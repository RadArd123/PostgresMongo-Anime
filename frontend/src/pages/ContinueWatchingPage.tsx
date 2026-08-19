import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContinueWatchingStore } from "@/store/continueWatchingStore";
import { Play, Check, Trash2, Film, ArrowLeft, Sparkles, Tv } from "lucide-react";
import { motion } from "framer-motion";

const ContinueWatchingPage = () => {
  const navigate = useNavigate();
  const { items, isLoading, fetchContinueWatching, removeItem, markCompleted } = useContinueWatchingStore();

  useEffect(() => {
    fetchContinueWatching();
  }, [fetchContinueWatching]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-100 pl-[80px] md:pl-[120px] pr-4 md:pr-10 py-10 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-[0.3em] text-blue-400 uppercase mb-2">
              <Sparkles className="size-3.5" /> STREAMING HISTORY
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Continue <span className="text-blue-500">Watching</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Pick up right where you left off and finish your anime episodes.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-gray-300 hover:text-white transition-all self-start sm:self-center"
          >
            <ArrowLeft size={16} /> Back to Browse
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-3xl bg-[#111111] border border-white/10 p-4 space-y-4 animate-pulse">
                <div className="w-full aspect-video bg-white/10 rounded-2xl" />
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-1/2 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const progressPercent = Math.min(100, Math.round((item.progress_seconds / item.duration_seconds) * 100)) || 20;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl bg-[#11131a] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-blue-500/50 transition-all duration-300"
                >
                  {/* Thumbnail & Progress Bar */}
                  <div
                    onClick={() => navigate(`/anime/episode/${item.episode_id}`)}
                    className="relative w-full aspect-video bg-neutral-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.img_url_banner || item.img_url_icon || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop"}
                      alt={item.anime_title || "Anime"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-transparent to-transparent" />

                    {/* Episode Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-xs font-black text-white flex items-center gap-1.5">
                      <Film size={12} className="text-blue-400" />
                      <span>EP {item.episode_number}</span>
                    </div>

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="size-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.8)] transform scale-90 group-hover:scale-100 transition-transform">
                        <Play size={20} className="fill-white translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/80">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Content & Action Controls */}
                  <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                    <div>
                      <h3
                        onClick={() => navigate(`/anime/episode/${item.episode_id}`)}
                        className="text-lg font-bold text-white line-clamp-1 cursor-pointer group-hover:text-blue-400 transition-colors"
                      >
                        {item.episode_title || `Episode ${item.episode_number}`}
                      </h3>
                      <p
                        onClick={() => navigate(`/anime/${item.anime_id}`)}
                        className="text-xs text-gray-400 hover:text-gray-200 mt-1 line-clamp-1 cursor-pointer transition-colors"
                      >
                        {item.anime_title || "Anime Series"}
                      </p>
                    </div>

                    {/* Button Row */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => navigate(`/anime/episode/${item.episode_id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
                      >
                        <Play size={14} className="fill-white" /> Resume
                      </button>

                      <button
                        onClick={() => markCompleted(item.episode_id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-green-500/20 text-gray-300 hover:text-green-400 border border-white/10 hover:border-green-500/40 text-xs font-semibold transition-all"
                        title="Mark as Completed"
                      >
                        <Check size={14} /> Complete
                      </button>

                      <button
                        onClick={() => removeItem(item.episode_id)}
                        className="size-8 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/40 flex items-center justify-center transition-all shrink-0"
                        title="Remove from history"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full py-24 rounded-3xl bg-[#11131a] border border-white/10 flex flex-col items-center justify-center text-center p-8 space-y-6 shadow-2xl">
            <div className="size-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Tv size={36} />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-bold text-white">No unfinished episodes</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                You're all caught up! Browse our anime collection and start watching a new episode to see it appear here.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold text-sm shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
              Explore Anime Series
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ContinueWatchingPage;
