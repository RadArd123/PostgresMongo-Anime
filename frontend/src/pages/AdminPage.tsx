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
import { BadgesTab } from "@/components/myComponents/BadgesTab";
import { axiosInstance } from "@/lib/axios";
import { LayoutDashboardIcon, VideoIcon, SparklesIcon, NewspaperIcon, ShieldCheckIcon, RefreshCwIcon, UsersIcon, MedalIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminRecordDialog from '@/components/myComponents/AdminRecordDialog';
import AdminMediaDialog from '@/components/myComponents/AdminMediaDialog';
import AdminEpisodesDirectory from '@/components/myComponents/AdminEpisodesDirectory';

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

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "animes" | "featured" | "news" | "badges">("overview");
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState('');

  const fetchAdminStats = async () => {
    setLoadingStats(true);
    setStatsError('');
    try {
      const res = await axiosInstance.get("/admin/stats");
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (e) {
      setStatsError('Unable to load statistics. Use Refresh Data to try again.');
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
    { id: "overview", label: "Overview & Analytics", icon: <LayoutDashboardIcon size={16} /> },
    { id: "users", label: "Users & Roles", icon: <UsersIcon size={16} /> },
    { id: "animes", label: "Animes & Episodes", icon: <VideoIcon size={16} /> },
    { id: "featured", label: "Hero & Suggestions", icon: <SparklesIcon size={16} /> },
    { id: "news", label: "Anime News", icon: <NewspaperIcon size={16} /> },
    { id: "badges", label: "Badges & Messages", icon: <MedalIcon size={16} /> },
  ] as const;

  const defaultStats: AdminStatsData = stats || {
    totalUsers: 0,
    totalAnimes: animes.length || 0,
    totalEpisodes: 0,
    totalNews: animeNews?.length || 0,
    totalSuggestions: suggestedAnimes?.length || 0,
    totalVisits: 0,
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
                  <ShieldCheckIcon className="size-6 text-blue-500" />
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "Righteous, cursive" }}>
                    Cyberwiz Admin Portal
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-400">
                  Manage core anime catalog, episodes, interactive banners, and monitor live PostgreSQL telemetry.
                </p>
              </div>

              <button
                onClick={() => { void fetchAdminStats(); void fetchAnimes(); void getAnimeNews(); void getHeroAnimes(); void getSuggestedAnimes(); }}
                disabled={loadingStats}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs font-bold text-white transition-all w-fit shadow-md"
              >
                <RefreshCwIcon size={14} className={loadingStats ? "animate-spin text-blue-400" : "text-gray-400"} />
                Refresh Data
              </button>
            </div>

            {/* Navigation Tabs */}
            {statsError && <p role="alert" className="text-sm text-red-300">{statsError}</p>}
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
                      <AdminMediaDialog kind="anime" records={animeSortedByName} onSaved={fetchAnimes} />
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
                  <AdminEpisodesDirectory animes={animeSortedByName} />
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
                      <AdminRecordDialog title="Delete Hero Banner" description="Remove a banner from the homepage" records={heroAnimes} destructive onSave={async id => { await axiosInstance.delete(`/anime-data/removeHeroAnime/${id}`); await getHeroAnimes(); }} />
                      <AdminMediaDialog kind="hero" records={heroAnimes} onSaved={getHeroAnimes} />
                      <DialogAddSuggestedAnime animes={animeSortedByName} />
                      <DialogUpdateSuggestedAnime animes={animeSortedByName} suggestedAnimes={suggestedAnimes} />
                      <AdminRecordDialog title="Delete Suggestion" description="Remove a suggested anime from the homepage" records={suggestedAnimes} destructive onSave={async id => { await axiosInstance.delete(`/anime-data/removeSuggestedAnime/${id}`); await getSuggestedAnimes(); }} />
                      <AdminMediaDialog kind="suggestion" records={suggestedAnimes} onSaved={getSuggestedAnimes} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[{ title: 'Hero Banners', records: heroAnimes }, { title: 'Suggestions', records: suggestedAnimes }].map(group => <div key={group.title} className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-3">
                      <h3 className="font-bold">{group.title} ({group.records.length})</h3>
                      {group.records.map(record => <p key={record.id} className="text-sm text-gray-300">{record.title}</p>)}
                      {!group.records.length && <p className="text-sm text-gray-400">No records yet.</p>}
                    </div>)}
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
                      <AdminMediaDialog kind="news" records={animeNews} onSaved={getAnimeNews} />
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

              {activeTab === "badges" && (
                <BadgesTab />
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
