import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronDown, Loader2 } from "lucide-react";
import { useLatestEpisodesStore } from "@/store/latestEpisodesStore";

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMins}m ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  return date.toLocaleDateString();
};

const NewEpisodesSection: React.FC = () => {
  const navigate = useNavigate();
  const { episodes, loading, page, hasMore, fetchLatestEpisodes } = useLatestEpisodesStore();

  useEffect(() => {
    fetchLatestEpisodes(1);
  }, [fetchLatestEpisodes]);

  return (
    <section className="w-full">
      <div className="max-w-8xl mx-auto">
        <div className="border-l-4 border-blue-700 pl-4 mb-8 px-4 flex justify-between items-end">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight">
              New Episodes
            </h1>
            <p className="text-gray-400 mt-2">Recently Added</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              onClick={() => navigate(`/anime/episode/${ep.id}`)}
              className="flex items-center p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors gap-4 cursor-pointer"
            >
              {/* thumbnail */}
              <div className="w-24 h-16 md:w-32 md:h-20 shrink-0 rounded-lg overflow-hidden shadow-lg relative group">
                <img
                  src={ep.img_url_icon || "https://via.placeholder.com/150"}
                  alt={ep.anime_title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* title + meta */}
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold truncate text-base md:text-lg mb-1">
                  {ep.anime_title}
                </div>
                <div className="text-sm text-gray-400 truncate mb-2">
                  {ep.title}
                </div>
                <div className="text-sm text-blue-100/60 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-300 font-semibold px-2.5 py-1 rounded-md border border-blue-500/20">
                    <svg
                      className="w-3.5 h-3.5 text-yellow-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 .587l3.668 7.431L24 9.748l-6 5.851 1.419 8.301L12 18.896 4.581 23.9 6 15.6 0 9.748l8.332-1.73L12 .587z" />
                    </svg>
                    <span>Episode {ep.episode_number}</span>
                  </span>
                </div>
              </div>

              {/* time on right */}
              <div className="flex flex-col items-end shrink-0 pl-2">
                <div className="flex text-xs md:text-sm text-blue-400/80 font-medium bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-800/30">
                  <Clock className="w-3.5 h-3.5 mr-1.5 mt-px text-blue-400" />
                  <span>{formatTimeAgo(ep.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading / Show More */}
        <div className="mt-12 flex justify-center">
          {loading && page === 1 ? (
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          ) : hasMore ? (
            <button
              onClick={() => fetchLatestEpisodes(page + 1)}
              disabled={loading}
              className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-full transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="font-semibold tracking-wide">Show More</span>
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </button>
          ) : episodes.length > 0 ? (
            <span className="text-gray-500 text-sm font-medium">No more episodes</span>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default NewEpisodesSection;

