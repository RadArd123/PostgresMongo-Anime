import { motion } from "framer-motion";
import type { Anime } from "@/interfaces/anime.types";
import { useNavigate } from "react-router-dom";
import { HeartIcon, BookmarkIcon } from "lucide-react";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useWatchlistStore } from "@/store/watchlistStore";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function BentoGridAnime({ animes, title }: { animes: Anime[], title: string }) {
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, currentUserFavorites } = useFavoritesStore();
  const { addToWatchlist, removeFromWatchlist, watchlist } = useWatchlistStore();

  const handleFavoriteClick = async (e: React.MouseEvent, animeId: number) => {
    e.stopPropagation();
    e.preventDefault();
    const existingFavorite = currentUserFavorites.find((fav: any) => fav.id === animeId);
    if (existingFavorite) await removeFavorite(existingFavorite.id);
    else await addFavorite(animeId);
  };

  const handleWatchlistClick = (e: React.MouseEvent, animeId: number) => {
    e.stopPropagation();
    e.preventDefault();
    const existingWatchlist = watchlist.find((wl: any) => wl.id === animeId);
    if (existingWatchlist) removeFromWatchlist(existingWatchlist.id);
    else addToWatchlist(animeId);
  };

  // Create a bento grid array (we'll take up to 5 items)
  const bentoItems = animes.slice(0, 5);
  if (bentoItems.length === 0) return null;

  return (
    <div className="w-full">
      <div className="border-l-4 border-primary pl-4 mb-6">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold leading-none">
          {title}
        </h1>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]"
      >
        {bentoItems.map((anime, index) => {
          const isFavorited = currentUserFavorites.some((fav: any) => fav?.id === anime.id);
          const isInWatchlist = watchlist.some((wl: any) => wl?.id === anime.id);
          
          // Different col/row spans for bento effect
          let spanClass = "col-span-1 row-span-1";
          if (index === 0) spanClass = "md:col-span-2 md:row-span-2"; // Featured item
          else if (index === 1) spanClass = "md:col-span-2 md:row-span-1"; // Wide item

          return (
            <motion.div
              key={anime.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/anime/${anime.id}`)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group bg-card border border-white/10 shadow-lg ${spanClass}`}
            >
              <img
                src={anime.img_url_icon}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex justify-between items-end">
                  <div className="max-w-[70%]">
                    <p className="text-sm md:text-lg font-bold text-white shadow-black drop-shadow-md line-clamp-2">
                      {anime.title}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleFavoriteClick(e, anime.id)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <HeartIcon
                        size={22}
                        className={`transition-colors drop-shadow-sm ${
                          isFavorited ? "text-primary fill-primary" : "text-white hover:text-red-200"
                        }`}
                      />
                    </button>

                    <button
                        onClick={(e) => handleWatchlistClick(e, anime.id)}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                      <BookmarkIcon
                        size={22}
                        className={`drop-shadow-sm ${
                          isInWatchlist ? "text-blue-500 fill-blue-500" : "text-white hover:text-blue-300"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
