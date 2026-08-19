import React, { useEffect, useState } from "react";
import UserSidebar from "@/components/myComponents/UserSidebar";
import StatCard from "@/components/myComponents/StatCard";
import AnimeAdmin from "@/components/myComponents/AnimeAdmin";
import NewsAdmin from "@/components/myComponents/NewsAdmin";
import DialogAddAnime from "@/components/myComponents/DialogAddAnime";
import DialogAddEpisode from "@/components/myComponents/DialogAddEpisode";
import { useAnimeStore } from "@/store/animeStore";
import DialogAddNews from "@/components/myComponents/DialogAddNews";
import DialogDeleteAnime from "@/components/myComponents/DialogDeleteAnime";
import DialogDeleteEpisode from "@/components/myComponents/DialogDeleteEpisode";
import { useEpisodeStore } from "@/store/episodeStore";
import { useAnimeNewsStore } from "@/store/animeNewsStore";
import DialogDeleteNews from "@/components/myComponents/DialogDeleteNews";
import DialogAddHeroAnime from "@/components/myComponents/DialogAddHeroAnime";
import DialogAddSuggestedAnime from "@/components/myComponents/DialogAddSuggestedAnime";
import DialogUpdateAnime from "@/components/myComponents/DialogUpdateAnime";
import DialogUpdateEpisode from "@/components/myComponents/DialogUpdateEpisode";
import DialogUpdateNews from "@/components/myComponents/DialogUpdateNews";
import DialogUpdateHeroAnime from "@/components/myComponents/DialogUpdateHeroAnime";
import DialogUpdateSuggestedAnime from "@/components/myComponents/DialogUpdateSuggestedAnime";
import { useHeroAnimeStore } from "@/store/heroAnime.Store";
import { useSuggestedAnimeStore } from "@/store/suggestedAnimeStore";
import { GenreDonutChart, ContentBarChart, ActivityAreaChart } from "@/components/myComponents/AdminCharts";
import UserManagementTable from "@/components/myComponents/UserManagementTable";
import { axiosInstance } from "@/lib/axios";
import { LayoutDashboard, Film, Sparkles, Newspaper, ShieldCheck, RefreshCw, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminStatsData {
  totalUsers: number;
  totalAnimes: number;
  totalEpisodes: number;
  totalNews: number;
  totalSuggestions: number;
  totalVisits: number;
  genreDistribution: { genre: string; count: number }[];
  recentActivity: { date: string; count: number }[];
}

const AdminPage: React.FC = () => {
  const { animes, fetchAnimes } = useAnimeStore();
  const { animeNews, getAnimeNews } = useAnimeNewsStore();
  const { fetchEpisodesByAnimeId, episodesById, resetEpisodes } = useEpisodeStore();
  const { heroAnimes, getHeroAnimes } = useHeroAnimeStore();
  const { suggestedAnimes, getSuggestedAnimes } = useSuggestedAnimeStore();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "animes" | "featured" | "news">("overview");
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchAdminStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axiosInstance.get("/admin/stats");
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (e) {
      console.error("Failed to load admin stats:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchAnimes();
    getAnimeNews();
    getHeroAnimes();
    getSuggestedAnimes();
    fetchAdminStats();
  }, [fetchAnimes, getAnimeNews, getHeroAnimes, getSuggestedAnimes]);

  const animeSortedByName = [...animes].sort((a, b) => a.title.localeCompare(b.title));
  const animeSortedByRecent = [...animes].sort((a, b) => b.id - a.id);

  const tabs = [
    { id: "overview", label: "Overview & Analytics", icon: <LayoutDashboard size={16} /> },
    { id: "users", label: "Users & Roles", icon: <Users size={16} /> },
    { id: "animes", label: "Animes & Episodes", icon: <Film size={16} /> },
    { id: "featured", label: "Hero & Suggestions", icon: <Sparkles size={16} /> },
    { id: "news", label: "Anime News", icon: <Newspaper size={16} /> },
  ] as const;

  const defaultStats: AdminStatsData = stats || {
    totalUsers: 1,
    totalAnimes: animes.length || 0,
    totalEpisodes: 0,
    totalNews: animeNews?.length || 0,
    totalSuggestions: suggestedAnimes?.length || 0,
    totalVisits: 1,
    genreDistribution: [],
    recentActivity: [],
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-100 flex">
      {/* ---- SIDEBAR ---- */}
      <section>
        <UserSidebar />
      </section>

      {/* ---- MAIN WRAPPER ---- */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
            
            {/* Header & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#21262d] pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-6 text-blue-500" />
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "Righteous, cursive" }}>
                    Cyberwiz Admin Portal
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-400">
                  Manage core anime catalog, episodes, interactive banners, and monitor live PostgreSQL telemetry.
                </p>
              </div>

              <button
                onClick={fetchAdminStats}
                disabled={loadingStats}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs font-bold text-white transition-all w-fit shadow-md"
              >
                <RefreshCw size={14} className={loadingStats ? "animate-spin text-blue-400" : "text-gray-400"} />
                Refresh Data
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#21262d] hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-[#161b22] border-blue-500 text-white shadow-lg"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-[#0d1117]"
                  }`}
                >
                  <span className={activeTab === tab.id ? "text-blue-400" : "text-gray-500"}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      label="Total Anime"
                      value={String(defaultStats.totalAnimes)}
                      badge="Catalog"
                      color="from-purple-600 to-blue-500"
                    />
                    <StatCard
                      label="Total Episodes"
                      value={String(defaultStats.totalEpisodes)}
                      badge="Streaming"
                      color="from-rose-500 to-orange-500"
                    />
                    <StatCard
                      label="Registered Users"
                      value={String(defaultStats.totalUsers)}
                      badge="Community"
                      color="from-emerald-500 to-lime-500"
                    />
                    <StatCard
                      label="Daily Telemetry Visits"
                      value={String(defaultStats.totalVisits)}
                      badge="Heatmap DB"
                      color="from-sky-500 to-blue-500"
                    />
                  </div>

                  {/* Interactive SVG/visx Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GenreDonutChart data={defaultStats.genreDistribution} />
                    <ContentBarChart stats={defaultStats} />
                  </div>

                  {/* Activity Area Chart */}
                  <div className="grid grid-cols-1 gap-6">
                    <ActivityAreaChart data={defaultStats.recentActivity} />
                  </div>

                  {/* Quick Preview of Recent Animes & News */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-4">
                    <div className="xl:col-span-2 space-y-4">
                      <h3 className="text-lg font-extrabold text-white">Recent Anime Added</h3>
                      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-4 overflow-hidden">
                        <AnimeAdmin animes={animeSortedByRecent.slice(0, 5)} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-extrabold text-white">Recent News</h3>
                      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-4 overflow-hidden">
                        {animeNews && animeNews.length > 0 ? (
                          <NewsAdmin news={animeNews.slice(0, 4)} />
                        ) : (
                          <p className="text-zinc-500 italic py-8 text-center text-sm">No news available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "animes" && (
                <motion.div
                  key="animes"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-[#21262d] pb-3 flex items-center justify-between">
                      <span>Anime Catalog & Episode Management</span>
                      <span className="text-xs font-normal text-gray-400">Add, Update, or Delete titles</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DialogAddAnime />
                      <DialogUpdateAnime animes={animeSortedByName} />
                      <DialogDeleteAnime animes={animeSortedByName} />
                      <DialogAddEpisode animes={animeSortedByName} />
                      <DialogUpdateEpisode
                        episodes={episodesById}
                        animes={animeSortedByName}
                        onFetchEpisodes={fetchEpisodesByAnimeId}
                        resetEpisodes={resetEpisodes}
                      />
                      <DialogDeleteEpisode
                        episodes={episodesById}
                        animes={animeSortedByName}
                        onFetchEpisodes={fetchEpisodesByAnimeId}
                        resetEpisodes={resetEpisodes}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-extrabold text-white">All Anime Directory ({animes.length})</h3>
                    <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-4 overflow-hidden">
                      <AnimeAdmin animes={animeSortedByRecent} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "featured" && (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-[#21262d] pb-3 flex items-center justify-between">
                      <span>Hero Banners & Suggested Anime Carousel</span>
                      <span className="text-xs font-normal text-gray-400">Configure frontpage highlights</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DialogAddHeroAnime animes={animeSortedByName} />
                      <DialogUpdateHeroAnime animes={animeSortedByName} heroAnimes={heroAnimes} />
                      <div className="hidden lg:block"></div>
                      <DialogAddSuggestedAnime animes={animeSortedByName} />
                      <DialogUpdateSuggestedAnime animes={animeSortedByName} suggestedAnimes={suggestedAnimes} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "news" && (
                <motion.div
                  key="news"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-[#21262d] pb-3 flex items-center justify-between">
                      <span>Anime News & Editorial Management</span>
                      <span className="text-xs font-normal text-gray-400">Publish or revise news posts</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DialogAddNews animes={animeSortedByName} />
                      <DialogUpdateNews animes={animeSortedByName} news={animeNews} />
                      <DialogDeleteNews news={animeNews} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-extrabold text-white">Published News Articles ({animeNews?.length || 0})</h3>
                    <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-4 overflow-hidden">
                      {animeNews && animeNews.length > 0 ? (
                        <NewsAdmin news={animeNews} />
                      ) : (
                        <p className="text-zinc-500 italic py-8 text-center">No news available.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <UserManagementTable />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
