import UserSidebar from "@/components/myComponents/UserSidebar";
import StatCard from "@/components/myComponents/StatCard";
import AnimeAdmin from "@/components/myComponents/AnimeAdmin";
import NewsAdmin from "@/components/myComponents/NewsAdmin";
import DialogAddAnime from "@/components/myComponents/DialogAddAnime";
import DialogAddEpisode from "@/components/myComponents/DialogAddEpisode";
import { useAnimeStore } from "@/store/animeStore";
import { useEffect } from "react";
import DialogAddNews from "@/components/myComponents/DialogAddNews";
import DialogDeleteAnime from "@/components/myComponents/DialogDeleteAnime";
import DialogDeleteEpisode from "@/components/myComponents/DialogDeleteEpisode";
import { useEpisodeStore } from "@/store/episodeStore";
import { useAnimeNewsStore } from "@/store/animeNewsStore";
import DialogDeleteNews from "@/components/myComponents/DialogDeleteNews";

const AdminPage: React.FC = () => {
  const { animes, fetchAnimes } = useAnimeStore();
  const { animeNews, getAnimeNews } = useAnimeNewsStore();
  const { fetchEpisodesByAnimeId, episodesById, resetEpisodes } =
    useEpisodeStore();

  const animeSortedByName = animes.sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  const animeSortedByRecent = [...animes].sort((a, b) => b.id - a.id);

  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

  useEffect(() => {
    getAnimeNews();
  }, [getAnimeNews]);

  console.log("anime news in AdminPage:", animeNews);

  return (
    <div className="min-h-screen w-full bg-black text-slate-100 flex">
      {/* ---- SIDEBAR ---- */}
      <section>
        <UserSidebar />
      </section>
      {/* ---- MAIN WRAPPER ---- */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-8xl mx-auto px-4 md:px-6 py-6 space-y-6">
            {/* ---- STATS (top cards) ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Anime"
                value="248"
                badge="+12%"
                color="from-purple-600 to-blue-500"
              />
              <StatCard
                label="Total Episodes"
                value="3,547"
                badge="+8%"
                color="from-rose-500 to-orange-500"
              />
              <StatCard
                label="Published News"
                value="89"
                badge="+23%"
                color="from-sky-500 to-blue-500"
              />
              <StatCard
                label="Active Users"
                value="12.4K"
                badge="+4%"
                color="from-emerald-500 to-lime-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DialogAddAnime />
              <DialogAddEpisode animes={animeSortedByName} />
              <DialogAddNews animes={animeSortedByName} />
              <DialogDeleteAnime animes={animeSortedByName} />
              <DialogDeleteEpisode
                episodes={episodesById}
                animes={animeSortedByName}
                onFetchEpisodes={fetchEpisodesByAnimeId}
                resetEpisodes={resetEpisodes}
              />
              <DialogDeleteNews news={animeNews} />
            </div>

            <div className=" gap-2 w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold ">
                  Recent Anime Created
                </h2>
                <h2 className=" absolute text-lg font-extrabold right-[13vw]">
                  Recent News Created
                </h2>
              </div>
              <div className="flex  flex-col lg:flex-row gap-5 items-start">
                <div className="lg:w-2/3 w-full">
                  <AnimeAdmin animes={animeSortedByRecent} />
                </div>
                <div className="lg:w-1/3 w-full">
                  {animeNews && animeNews.length > 0 ? (
                    <NewsAdmin news={animeNews} />
                  ) : (
                    <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
                      <p className="text-zinc-500 italic">No news available.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
