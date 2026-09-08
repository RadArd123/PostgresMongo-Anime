import React, { useEffect, useState, useMemo } from "react";
import { useProfileStore } from "../store/profileStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { useWatchlistStore } from "../store/watchlistStore";
import { useThemeStore, type ThemeColor } from "../store/themeStore";
import {
  Loader2Icon, Edit3Icon, Trash2Icon, MailIcon, CalendarIcon,
  HeartIcon, BookmarkIcon, EyeIcon, FlameIcon, StarIcon, TvMinimalPlayIcon,
  BarChart3Icon, SwordsIcon, CompassIcon, ZapIcon, GhostIcon, MusicIcon, UserIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EditProfileDialog from "../components/myComponents/EditProfileDialog";
import DeleteAccountDialog from "../components/myComponents/DeleteAccountDialog";
import AnimeRadarChart from "../components/myComponents/AnimeRadarChart";
import AnimeHeatmap from "../components/myComponents/AnimeHeatmap";
import sukunaBanner from "@/assets/sukuna-mahoraga.gif";

// ─── Helpers ────────────────────────────────────────────
const GENRE_ICONS: Record<string, React.ReactNode> = {
  Action: <SwordsIcon size={14} />, Adventure: <CompassIcon size={14} />,
  Fantasy: <ZapIcon size={14} />, Horror: <GhostIcon size={14} />,
  Romance: <HeartIcon size={14} />, Comedy: <FlameIcon size={14} />,
  MusicIcon: <MusicIcon size={14} />, Supernatural: <StarIcon size={14} />,
};

/** Extract genre → count from an array of anime objects */
const getGenreCounts = (animes: any[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  animes.forEach((a) => {
    if (!a.genre) return;
    a.genre.split(",").forEach((g: string) => {
      const t = g.trim();
      if (t) counts[t] = (counts[t] || 0) + 1;
    });
  });
  return counts;
};

/** Generate heatmap data from real database activity */
const generateHeatmapData = (activity: { date: string; count: number }[] = []) => {
  const days: { date: Date; count: number }[] = [];
  const now = new Date();
  const activityMap = new Map(activity.map(a => [a.date, Number(a.count) || 0]));

  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    // Format locally as YYYY-MM-DD to match PostgreSQL visit_date exactly
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const count = activityMap.get(dateStr) || 0;
    days.push({ date: d, count });
  }
  return days;
};

// ─── Stat Card ────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5 flex flex-col gap-2 hover:border-[#30363d] transition-colors"
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="text-3xl font-black text-white">{value}</div>
    <div className="text-xs text-gray-500 font-medium uppercase tracking-widest">{label}</div>
  </motion.div>
);

// ─── Section Header ────────────────────────────────────────────
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#21262d]">
    <div className="text-gray-400">{icon}</div>
    <h3 className="text-base font-bold text-white" style={{ fontFamily: "Righteous, cursive" }}>
      {title}
    </h3>
  </div>
);

// ─── Main Component ─────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const { profile, activity, loading, error, fetchProfile, fetchActivity } = useProfileStore();
  const { currentUserFavorites, fetchFavorites } = useFavoritesStore();
  const { watchlist, fetchWatchlist } = useWatchlistStore();
  const { themeColor, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => { fetchProfile(); fetchActivity(); }, [fetchProfile, fetchActivity]);
  useEffect(() => { fetchFavorites(); }, []);
  useEffect(() => { fetchWatchlist(); }, []);

  // ── Radar Chart Data ──
  const radarData = useMemo(() => {
    const allAnimes = [...currentUserFavorites, ...watchlist];
    const counts = getGenreCounts(allAnimes);
    const max = Math.max(1, ...Object.values(counts));
    const normalize = (v: number) => Math.round((v / max) * 100);

    const metrics = [
      { key: "Action", label: "Action" },
      { key: "Romance", label: "Romance" },
      { key: "Fantasy", label: "Fantasy" },
      { key: "Horror", label: "Horror" },
      { key: "Comedy", label: "Comedy" },
      { key: "Adventure", label: "Adventure" },
    ];

    const values: Record<string, number> = {};
    metrics.forEach((m) => {
      values[m.key] = normalize(counts[m.key] || 0);
    });

    return {
      metrics,
      series: [
        {
          label: "Gustul Tău",
          color: "#3b82f6",
          values,
        },
      ],
    };
  }, [currentUserFavorites, watchlist]);

  // ── Heatmap Data ──
  const heatmapData = useMemo(() => {
    return generateHeatmapData(activity);
  }, [activity]);

  // ── Top Genres ──
  const topGenres = useMemo(() => {
    const allAnimes = [...currentUserFavorites, ...watchlist];
    const counts = getGenreCounts(allAnimes);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [currentUserFavorites, watchlist]);

  // ── Total activity count ──
  const totalVisits = useMemo(() => {
    return heatmapData.reduce((acc, d) => acc + d.count, 0);
  }, [heatmapData]);

  // ── Loading / Error ──
  if (loading && !profile) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen bg-[#010409]">
        <Loader2Icon className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }
  if (error) return <div className="flex-1 flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  if (!profile) return null;

  const defaultBanner = sukunaBanner;
  const avatarUrl = profile.avatar_url;
  const bannerUrl = profile.banner_url || defaultBanner;
  const joinYear = new Date(profile.profile_created_at).getFullYear();

  return (
    <div className="flex-1 min-h-screen bg-[#010409] text-gray-200 ">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-8">

        {/* ════════════════ LEFT SIDEBAR ════════════════ */}
        <aside className="w-full lg:w-[260px] shrink-0 flex flex-col gap-4">

          {/* Avatar */}
          <div className="relative">
            <div className="w-[240px] h-[240px] rounded-full overflow-hidden border-4 border-[#21262d] shadow-2xl relative group mx-auto lg:mx-0 flex items-center justify-center bg-[#161b22]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <UserIcon className="w-32 h-32 text-[#21262d] opacity-50" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditOpen(true)} className="bg-white/20 p-3 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors">
                  <Edit3Icon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Name / Bio */}
          <div className="mt-2">
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Righteous, cursive" }}>
              {profile.username}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Otaku / Pasionat de Anime</p>
            {profile.status && (
              <p className="text-gray-300 text-sm mt-3 leading-relaxed italic">"{profile.status}"</p>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="w-full bg-[#21262d] hover:bg-[#30363d] text-white text-sm font-semibold py-2 px-4 rounded-lg border border-[#30363d] transition-colors flex items-center justify-center gap-2"
          >
            <Edit3Icon className="w-4 h-4" /> Editează profilul
          </button>

          {/* Meta */}
          <div className="space-y-2 text-sm text-gray-400 border-t border-[#21262d] pt-4">
            <div className="flex items-center gap-2">
              <MailIcon className="w-4 h-4 text-gray-500" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span>Înscris în {new Date(profile.profile_created_at).toLocaleDateString("ro-RO", { month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Quick counts */}
          <div className="flex gap-4 text-sm text-gray-400 border-t border-[#21262d] pt-4">
            <span className="flex items-center gap-1.5"><HeartIcon size={14} className="text-red-400" /><b className="text-white">{currentUserFavorites.length}</b> Favorite</span>
            <span className="flex items-center gap-1.5"><BookmarkIcon size={14} className="text-blue-400" /><b className="text-white">{watchlist.length}</b> Watchlist</span>
          </div>

          {/* Top Genres tags */}
          {topGenres.length > 0 && (
            <div className="border-t border-[#21262d] pt-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-3">Genuri Preferate</p>
              <div className="flex flex-wrap gap-2">
                {topGenres.map(([genre]) => (
                  <span key={genre} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161b22] border border-[#21262d] text-xs text-gray-300">
                    {GENRE_ICONS[genre] || <StarIcon size={12} />}
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Theme Color Selector */}
          <div className="border-t border-[#21262d] pt-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center justify-between">
              <span>Theme Color</span>
              <span className="text-blue-400 capitalize">{themeColor}</span>
            </p>
            <div className="grid grid-cols-6 gap-2">
              {[
                { id: "blue", label: "Blue", bg: "bg-blue-600" },
                { id: "red", label: "Red", bg: "bg-red-600" },
                { id: "green", label: "Green", bg: "bg-green-600" },
                { id: "purple", label: "Purple", bg: "bg-purple-600" },
                { id: "gold", label: "Gold", bg: "bg-amber-600" },
                { id: "cyan", label: "Cyan", bg: "bg-cyan-500" },
              ].map((color) => (
                <button
                  key={color.id}
                  onClick={() => setTheme(color.id as ThemeColor)}
                  title={color.label}
                  className={`size-8 rounded-full ${color.bg} transition-all duration-300 flex items-center justify-center border-2 ${themeColor === color.id
                      ? "border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                      : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="border-t border-red-900/20 pt-4 mt-auto">
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="w-full text-sm text-red-500 hover:text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2Icon className="w-4 h-4" /> Șterge contul
            </button>
          </div>
        </aside>

        {/* ════════════════ MAIN CONTENT ════════════════ */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">

          {/* ── Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-52 md:h-64 rounded-2xl overflow-hidden border border-[#21262d] shadow-2xl relative group"
          >
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010409] via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-6">
              <h2 className="text-4xl font-black text-white drop-shadow-xl" style={{ fontFamily: "Righteous, cursive" }}>
                {profile.bio?.split(" ").slice(0, 4).join(" ") || profile.username}
              </h2>
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all border border-white/10"
            >
              <Edit3Icon className="w-4 h-4 text-white" />
            </button>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<HeartIcon size={16} className="text-red-400" />} label="Favorite" value={currentUserFavorites.length} color="bg-red-500/10" />
            <StatCard icon={<BookmarkIcon size={16} className="text-blue-400" />} label="Watchlist" value={watchlist.length} color="bg-blue-500/10" />
            <StatCard icon={<EyeIcon size={16} className="text-green-400" />} label="Vizite Aplicație" value={totalVisits} color="bg-green-500/10" />
            <StatCard icon={<TvMinimalPlayIcon size={16} className="text-purple-400" />} label="Since" value={joinYear} color="bg-purple-500/10" />
          </div>

          {/* ── Heatmap ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 hover:border-[#30363d] transition-colors"
          >
            <AnimeHeatmap data={heatmapData} totalVisits={totalVisits} />
          </motion.div>

          {/* ── Two-column: Radar + About ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 hover:border-[#30363d] transition-colors flex flex-col"
            >
              <SectionHeader icon={<BarChart3Icon size={16} />} title="Profilul Gusturilor Anime" />
              <div className="flex-1 flex items-center justify-center">
                {radarData.series[0] && Object.values(radarData.series[0].values).some(v => v > 0) ? (
                  <AnimeRadarChart
                    metrics={radarData.metrics}
                    data={radarData.series}
                    size={300}
                  />
                ) : (
                  <div className="text-center text-gray-600 py-10">
                    <StarIcon className="mx-auto mb-3 opacity-30" size={40} />
                    <p className="text-sm">Adaugă favorite pentru a vedea profilul gusturilor</p>
                  </div>
                )}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-2 mt-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 opacity-70" />
                <span className="text-xs text-gray-500">Bazat pe {currentUserFavorites.length + watchlist.length} anime</span>
              </div>
            </motion.div>

            {/* About + Bio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 hover:border-[#30363d] transition-colors flex flex-col gap-4"
            >
              <SectionHeader icon={<FlameIcon size={16} />} title="Despre Mine" />
              <p className="text-gray-300 text-sm leading-relaxed">
                {profile.bio || "Nicio biografie încă. Spune lumii care e anime-ul tău preferat!"}
              </p>

              {/* Preferred Genres ranked list */}
              {topGenres.length > 0 && (
                <div className="mt-2">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-3">Genre Breakdown</p>
                  <div className="space-y-2">
                    {topGenres.map(([genre, count], i) => {
                      const pct = Math.min(100, Math.round((count / (topGenres[0][1] || 1)) * 100));
                      return (
                        <div key={genre}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-300 flex items-center gap-1.5">
                              {GENRE_ICONS[genre] || <StarIcon size={11} />} {genre}
                            </span>
                            <span className="text-xs text-gray-500">{count}</span>
                          </div>
                          <div className="h-1.5 bg-[#161b22] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.4 + i * 0.07, duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Recent Favorites Preview ── */}
          {currentUserFavorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 hover:border-[#30363d] transition-colors"
            >
              <SectionHeader icon={<HeartIcon size={16} />} title={`Favorite — ${currentUserFavorites.length} anime`} />
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {currentUserFavorites.slice(0, 12).map((anime: any) => (
                  <motion.div
                    key={anime.id}
                    onClick={() => navigate(`/anime/${anime.id}`)}
                    whileHover={{ scale: 1.05 }}
                    className="shrink-0 w-20 cursor-pointer"
                  >
                    <div className="w-20 h-28 rounded-xl overflow-hidden border border-[#21262d] shadow-md">
                      <img src={anime.img_url_icon} alt={anime.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1.5 text-center line-clamp-2 leading-tight">{anime.title}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* Modals */}
      {isEditOpen && <EditProfileDialog onClose={() => setIsEditOpen(false)} />}
      {isDeleteOpen && <DeleteAccountDialog onClose={() => setIsDeleteOpen(false)} />}
    </div>
  );
};

export default ProfilePage;
