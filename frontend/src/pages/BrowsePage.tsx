import { useEffect, useState, useMemo } from "react";
import { SearchIcon, PlayIcon, SwordsIcon, HeartIcon, GhostIcon, FlameIcon, CompassIcon, ZapIcon, StarIcon } from "lucide-react";
import { useHeroAnimeStore } from "@/store/heroAnime.Store";
import { useAnimeStore } from "@/store/animeStore";
import { useSettingsStore } from "@/store/settingsStore";
import AnimeCard from "@/components/myComponents/AnimeCard";
import { useNavigate } from "react-router-dom";

// Helper for genre icons
const getGenreIcon = (genreName: string) => {
  const g = genreName.toLowerCase();
  if (g.includes("action") || g.includes("shonen")) return <SwordsIcon size={16} className="mr-2" />;
  if (g.includes("romance") || g.includes("romantic")) return <HeartIcon size={16} className="mr-2" />;
  if (g.includes("horror") || g.includes("thriller") || g.includes("dark")) return <GhostIcon size={16} className="mr-2" />;
  if (g.includes("comedy")) return <FlameIcon size={16} className="mr-2" />;
  if (g.includes("adventure")) return <CompassIcon size={16} className="mr-2" />;
  if (g.includes("fantasy") || g.includes("supernatural") || g.includes("magic")) return <ZapIcon size={16} className="mr-2" />;
  return <StarIcon size={16} className="mr-2" />;
};

const BrowsePage = () => {
  const navigate = useNavigate();
  const { heroAnimes, getHeroAnimes } = useHeroAnimeStore();
  const { animes, fetchAnimes } = useAnimeStore();
  const { layoutMode } = useSettingsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    getHeroAnimes();
    fetchAnimes();
  }, []);

  // Extrage genurile unice din toate anime-urile
  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    animes.forEach((anime) => {
      if (anime.genre) {
        anime.genre.split(",").forEach((g) => {
          const trimmed = g.trim();
          if (trimmed) genresSet.add(trimmed);
        });
      }
    });
    return Array.from(genresSet).sort();
  }, [animes]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Filtreaza anime-urile pe baza cautarii si genurilor
  const filteredAnimes = useMemo(() => {
    return animes.filter((anime) => {
      const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenres = selectedGenres.length === 0 || selectedGenres.every((selectedGenre) => {
        return anime.genre?.toLowerCase().includes(selectedGenre.toLowerCase());
      });

      return matchesSearch && matchesGenres;
    });
  }, [animes, searchQuery, selectedGenres]);

  return (
    <div className="w-full h-full min-h-screen bg-black text-slate-100 flex flex-col justify-between">
      {/* Responsive container clearing sidebar */}
      <div className="relative w-full px-4 md:pl-[130px] lg:pl-[150px] md:pr-16 pt-12 pb-12 z-10 flex-1">
        
        {/* Flix.id Style Featured Banners */}
        <section className="mb-10 w-full max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {heroAnimes.slice(0, 2).map((hero) => (
              <div 
                key={hero.id} 
                onClick={() => navigate(`/anime/${hero.postgres_anime_id}`)}
                className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden cursor-pointer group"
              >
                {/* Background Image */}
                <img 
                  src={hero.background_image} 
                  alt={hero.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Dark Gradient Overlay matching Flix.id */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent pointer-events-none" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <h1 className="text-3xl md:text-5xl font-black text-white heading-font drop-shadow-xl w-3/4 leading-tight tracking-tight">
                    {hero.title}
                  </h1>
                  
                  <button className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                      <PlayIcon className="w-4 h-4 md:w-5 md:h-5 text-white fill-white ml-1" />
                    </div>
                    <span className="text-sm md:text-base font-medium text-white shadow-black drop-shadow-md">
                      Let Play Movie
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SearchIcon & Filter Section */}
        <section className="mb-12 w-full max-w-[1400px] mx-auto">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col gap-6">
            
            {/* Top Scrolling Genre Row */}
            <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-2">
              {allGenres.slice(0, 8).map((genre) => {
                const isActive = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`shrink-0 flex items-center px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                      isActive
                        ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : "bg-[#222222] text-gray-300 border-[#333333] hover:border-gray-400 hover:text-white"
                    }`}
                  >
                    {getGenreIcon(genre)}
                    {genre}
                  </button>
                );
              })}
            </div>

            {/* SearchIcon Bar */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Caută anime după titlu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-[#0d0d0d] border border-[#222222] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all text-sm md:text-base"
              />
            </div>
            
          </div>
        </section>

        {/* Results Grid */}
        <section className="mb-20 w-full max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white heading-font">
              {filteredAnimes.length} Rezultate
            </h2>
          </div>
          
          {filteredAnimes.length > 0 ? (
            <div className={layoutMode === 'list' 
              ? "flex flex-col gap-3" 
              : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            }>
              {filteredAnimes.map((anime) => (
                <div key={anime.id} className="w-full">
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/10">
              <SearchIcon className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Niciun anime găsit</h3>
              <p className="text-gray-400 max-w-md">
                Nu am găsit niciun anime care să corespundă criteriilor de căutare și filtrare. Încearcă să ajustezi filtrele.
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default BrowsePage;
