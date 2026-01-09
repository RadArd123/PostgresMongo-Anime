import { Play, Bookmark, Star, Eye } from "lucide-react";

interface AnimeSuggestionItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  views: string;
}

const animeSuggestions: AnimeSuggestionItem[] = [
  {
    id: 1,
    title: "JUJUTSU KAISEN",
    description:
      "JUJUTSU KAISEN is a serialized manga series with story and artwork by Gege Akutami and published in Weekly Shonen Jump. An anime adaptation came shortly after, blending intense action and grounded character moments.",
    imageUrl: "src/assets/jjk.png",
    category: "Trending",
    rating: 9.2,
    views: "2.5M",
  },
];

const AnimeSuggestion: React.FC = () => {
  const anime = animeSuggestions[0];
  if (!anime) return null;

  return (
    <section className="w-full ">
          <div className="border-l-4 border-blue-700 pl-4 mb-8 px-4">
          <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight">
            Anime Suggestion
          </h1>
        </div>
      <div className="max-w-8xl mx-auto px-6  rounded-3xl  border border-gray-800 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-8">
          {/* Poster column */}
          <div className="md:col-span-5 flex justify-center md:justify-start px-4 group">
            <div className="relative w-[320px] md:w-[480px] lg:w-[660px]">
              <div className="rounded-2xl overflow-hidden shadow-2xl w-full">
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  className="w-full h-[420px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-extrabold tracking-wide">
                {anime.category}
              </div>
            </div>
          </div>
          {/* Content column */}
          <div className="md:col-span-7 text-white px-6 md:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3">
              {anime.title}
            </h1>
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-300">
              <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400" />
                <strong>{anime.rating}</strong>
              </div>
              <div className="inline-flex items-center gap-2 text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{anime.views}</span>
              </div>
            </div>

            <p className="text-gray-300 max-w-2xl leading-relaxed mb-8">
              {anime.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-3 bg-linear-to-r from-blue-400 to-blue-600 text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <Play className="w-5 h-5" />
                Start Watching
              </button>

              <button className="flex items-center gap-2 border border-blue-500 text-blue-500 px-5 py-3 rounded-lg hover:bg-white/5 transition">
                <Bookmark className="w-4 h-4" />
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
