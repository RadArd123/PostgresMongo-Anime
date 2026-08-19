import { useEffect } from "react";
import { Play, Bookmark, Star, Eye } from "lucide-react";
import { useSuggestedAnimeStore } from "@/store/suggestedAnimeStore";

const AnimeSuggestion: React.FC = () => {
  const { suggestedAnimes, getSuggestedAnimes } = useSuggestedAnimeStore();

  useEffect(() => {
    getSuggestedAnimes();
  }, [getSuggestedAnimes]);

  const anime = suggestedAnimes[0];
  if (!anime) return null;

  return (
    <section className="w-full ">
          <div className="border-l-4 border-blue-700 pl-4 mb-8 px-4">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight">
            Anime Suggestion
          </h1>
        </div>
      <div className="max-w-8xl mx-auto rounded-[32px] bg-white/[0.02] border border-white/10  overflow-hidden ">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center p-8 lg:p-12">
          {/* Poster / Image */}
          <div className="relative w-full md:w-1/2 max-w-[600px] shrink-0 group">
            <div className="rounded-2xl overflow-hidden  w-full">
              <img
                src={anime.poster_image}
                alt={anime.title}
                className="w-full h-auto md:h-[400px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg">
              {anime.badge_label}
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 text-white flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
              {anime.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-300">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                <Star className="w-4 h-4 text-yellow-400" />
                <strong className="text-yellow-400 font-bold">{anime.rating}</strong>
              </div>
              <div className="inline-flex items-center gap-2 text-gray-400 bg-white/5 px-3 py-1.5 rounded-full">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{anime.views_count} Views</span>
              </div>
            </div>

            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-[90%]">
              {anime.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95">
                <Play className="w-5 h-5 fill-current" />
                Start Watching
              </button>

              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 rounded-xl transition-all active:scale-95 font-semibold">
                <Bookmark className="w-5 h-5" />
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimeSuggestion;
