import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEpisodeStore } from "@/store/episodeStore";
import { useAnimeStore } from "@/store/animeStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useWatchlistStore } from "@/store/watchlistStore";
import { useContinueWatchingStore } from "@/store/continueWatchingStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Play, Heart, Bookmark, ArrowLeft, Tv, Check, ChevronLeft, ChevronRight, Flame, Film } from "lucide-react";
import { motion } from "framer-motion";

const EpisodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef<HTMLDivElement>(null);

  const { currentEpisode, getEpisodeById, episodesById, fetchEpisodesByAnimeId } = useEpisodeStore();
  const { anime, getAnimeById } = useAnimeStore();
  const { currentUserFavorites, addFavorite, removeFavorite, fetchFavorites } = useFavoritesStore();
  const { watchlist, addToWatchlist, removeFromWatchlist, fetchWatchlist } = useWatchlistStore();
  const { items, fetchContinueWatching, updateProgress, markCompleted } = useContinueWatchingStore();
  const { autoPlayNext, defaultQuality } = useSettingsStore();

  useEffect(() => {
    if (id && getEpisodeById) getEpisodeById(Number(id));
  }, [id, getEpisodeById]);

  useEffect(() => {
    if (currentEpisode?.anime_id) {
      if (fetchEpisodesByAnimeId) fetchEpisodesByAnimeId(currentEpisode.anime_id);
      if (getAnimeById) getAnimeById(currentEpisode.anime_id);
    }
  }, [currentEpisode, fetchEpisodesByAnimeId, getAnimeById]);

  useEffect(() => {
    fetchFavorites();
    fetchWatchlist();
    fetchContinueWatching();
  }, [fetchFavorites, fetchWatchlist, fetchContinueWatching]);

  // Track progress when episode is loaded
  const progressRef = useRef(120); // start at 2 mins
  useEffect(() => {
    if (!currentEpisode) return;
    progressRef.current = 120;
    updateProgress(currentEpisode.anime_id, currentEpisode.id, progressRef.current, 1440, false);

    // Update progress every 30 seconds while watching
    const interval = setInterval(() => {
      progressRef.current += 30;
      // If watched >= 20 mins (1200s, reached outro), automatically mark completed!
      if (progressRef.current >= 1200) {
        markCompleted(currentEpisode.id);
        clearInterval(interval);
        // Auto-play next episode if setting is enabled
        if (autoPlayNext) {
          const eps = useEpisodeStore.getState().episodesById;
          const idx = eps?.findIndex(e => e.id === currentEpisode.id) ?? -1;
          const next = idx >= 0 && idx < (eps?.length || 0) - 1 ? eps![idx + 1] : null;
          if (next) {
            navigate(`/anime/episode/${next.id}`);
          }
        }
      } else {
        updateProgress(currentEpisode.anime_id, currentEpisode.id, progressRef.current, 1440, false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentEpisode?.id, currentEpisode?.anime_id]);

  if (!currentEpisode || currentEpisode.id !== Number(id)) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-100 flex items-center justify-center pl-[80px]">
        <div className="loader border-t-4 border-b-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  }

  const animeId = currentEpisode.anime_id;
  const isFavorite = currentUserFavorites.some((fav: any) => fav.id === animeId);
  const isInWatchlist = watchlist.some((item: any) => item.id === animeId);
  const cwItem = items.find((item) => item.episode_id === currentEpisode.id);


  const handleFavoriteClick = async () => {
    if (isFavorite) {
      const favObj = currentUserFavorites.find((fav: any) => fav.id === animeId);
      if (favObj) await removeFavorite(favObj.id);
    } else {
      await addFavorite(animeId);
    }
  };

  const handleWatchlistClick = async () => {
    if (isInWatchlist) {
      const watchObj = watchlist.find((item: any) => item.id === animeId);
      if (watchObj) await removeFromWatchlist(watchObj.id);
    } else {
      await addToWatchlist(animeId);
    }
  };


  // Compute Next / Previous episodes for circular navigation buttons
  const currentIndex = episodesById?.findIndex(e => e.id === currentEpisode.id) ?? -1;
  const prevEpisode = currentIndex > 0 ? episodesById![currentIndex - 1] : null;
  const nextEpisode = currentIndex >= 0 && currentIndex < (episodesById?.length || 0) - 1 ? episodesById![currentIndex + 1] : null;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-100 pl-[80px] md:pl-[120px] pr-4 md:pr-10 py-6 flex flex-col items-center">
      <div className="w-full max-w-[95rem] space-y-8">
        
        {/* ─── Top Bar: Navigation & Streaming Status ─── */}
        <div className="flex items-center justify-between w-full pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/anime/${animeId}`)}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-gray-200 hover:text-white transition-all shadow-lg backdrop-blur-md"
            >
              <ArrowLeft size={16} /> Back to {anime?.title || "Series"}
            </button>
            <span className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-xs font-extrabold text-red-400 uppercase tracking-wider">
              <Flame className="size-3.5 fill-red-400" /> Now Playing
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
            <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-white font-bold">{defaultQuality === 'auto' ? 'AUTO' : defaultQuality} {defaultQuality === '1080p' ? 'HD' : ''}</span>
            <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-blue-400 font-bold">EP {currentEpisode.episode_number}</span>
          </div>
        </div>

        {/* ─── Main Widescreen Cinematic Video Player ─── */}
        <div ref={playerRef} className="relative w-full aspect-video overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(37,99,235,0.25)] border border-white/15 bg-black">
          <iframe
            src={currentEpisode.video_url}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* ─── Episode Info & Navigation Control Bar ─── */}
        <div className="rounded-3xl bg-[#11131a] border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-black uppercase tracking-wider">
                EPISODE {currentEpisode.episode_number}
              </span>
              <span className="text-sm font-bold text-gray-400">{anime?.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentEpisode.title || `Episode ${currentEpisode.episode_number}`}
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 pt-1">
              {anime?.description}
            </p>
          </div>

          {/* Controls: Next/Prev Circular Buttons & Action Pills */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-start lg:justify-end shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
            {/* Circular Arrow Navigation */}
            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={() => prevEpisode && navigate(`/anime/episode/${prevEpisode.id}`)}
                disabled={!prevEpisode}
                className="size-12 rounded-full bg-black/60 hover:bg-white/20 border border-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:scale-110 active:scale-95 shadow-lg"
                title={prevEpisode ? `Previous: Ep ${prevEpisode.episode_number}` : "No previous episode"}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => {
                  if (nextEpisode) {
                    markCompleted(currentEpisode.id);
                    navigate(`/anime/episode/${nextEpisode.id}`);
                  }
                }}
                disabled={!nextEpisode}
                className="size-12 rounded-full bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all disabled:opacity-25 disabled:bg-black/60 disabled:border-white/25 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                title={nextEpisode ? `Next: Ep ${nextEpisode.episode_number}` : "No next episode"}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all text-xs font-bold backdrop-blur-md ${
                isFavorite
                  ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  : "bg-white/5 hover:bg-white/10 border-white/15 text-gray-200"
              }`}
            >
              <Heart size={16} className={isFavorite ? "fill-red-400" : ""} />
              {isFavorite ? "Favorited" : "Favorite"}
            </button>

            {/* Watchlist Button */}
            <button
              onClick={handleWatchlistClick}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all text-xs font-bold backdrop-blur-md ${
                isInWatchlist
                  ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "bg-white/5 hover:bg-white/10 border-white/15 text-gray-200"
              }`}
            >
              {isInWatchlist ? <Check size={16} /> : <Bookmark size={16} />}
              {isInWatchlist ? "În Watchlist" : "Adaugă la Watchlist"}
            </button>

            {/* Mark as Completed Toggle Button */}
            <button
              onClick={() => {
                if (cwItem?.completed) {
                  updateProgress(animeId, currentEpisode.id, 120, 1440, false);
                } else {
                  markCompleted(currentEpisode.id);
                }
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all text-xs font-bold backdrop-blur-md ${
                cwItem && !cwItem.completed
                  ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              }`}
            >
              <Check size={16} className={!cwItem || cwItem.completed ? "text-green-400" : "text-amber-400"} />
              {!cwItem || cwItem.completed ? "Completed" : "Mark as Completed"}
            </button>
          </div>
        </div>

        {/* ─── Bottom Episode Carousel Dock (Like Reference Image) ─── */}
        <div className="rounded-3xl bg-[#0f1117] border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 font-mono text-xs font-extrabold tracking-[0.2em] text-blue-400 uppercase">
              <Tv size={16} /> SERIES EPISODES ({episodesById?.length || 0})
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Click any card to switch stream
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 pt-1 hide-scrollbar">
            {episodesById && episodesById.length > 0 ? (
              episodesById.map((ep) => {
                const isActive = ep.id === currentEpisode.id;
                return (
                  <motion.div
                    key={ep.id}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/anime/episode/${ep.id}`)}
                    className={`shrink-0 w-60 sm:w-68 rounded-2xl overflow-hidden bg-[#161822] border transition-all duration-300 cursor-pointer flex flex-col group relative ${
                      isActive
                        ? "border-2 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.5)] bg-blue-950/20 scale-102 z-10"
                        : "border-white/10 hover:border-white/30 opacity-75 hover:opacity-100"
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div className="relative w-full aspect-[16/9] bg-neutral-900 overflow-hidden">
                      <img
                        src={anime?.img_url_banner || anime?.img_url_icon || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop"}
                        alt={ep.title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                          isActive ? "opacity-90" : "opacity-60 group-hover:opacity-80"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161822] via-transparent to-transparent" />

                      {/* Episode Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-black text-white flex items-center gap-1">
                        <Film size={11} className="text-blue-400" />
                        <span>EP {ep.episode_number}</span>
                      </div>

                      {/* Active Status Badge or Play Icon */}
                      {isActive ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-600/30 backdrop-blur-xs">
                          <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-pulse">
                            <Play size={10} className="fill-white" /> Playing Now
                          </span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.8)] transform group-hover:scale-110 transition-transform">
                            <Play size={16} className="fill-white translate-x-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 bg-[#1a1d2a]">
                      <h4 className={`text-xs font-bold line-clamp-1 transition-colors ${
                        isActive ? "text-blue-400" : "text-white group-hover:text-blue-300"
                      }`}>
                        {ep.title || `Episode ${ep.episode_number}`}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                        {anime?.title || "Anime Series"}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-slate-400 text-sm py-4">No other episodes found for this anime.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EpisodePage;