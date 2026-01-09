
import type { FavoriteAnime } from "@/interfaces/anime.types";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useWatchlistStore } from "@/store/watchlistStore";
import { Bookmark, Heart } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
    

const AnimeFavWatch = ({ animes }: { animes: FavoriteAnime[] }) => {

  const navigate = useNavigate();
    const { addFavorite, removeFavorite, currentUserFavorites, fetchFavorites } = useFavoritesStore();
    const { addToWatchlist, removeFromWatchlist, watchlist, fetchWatchlist } = useWatchlistStore();
    
    useEffect(() => {
  
      fetchFavorites();
    }, [currentUserFavorites.length]);
  
    useEffect(() => {
   
      fetchWatchlist();
    }, [watchlist.length]);
  
    const handleFavoriteClick = async (e: React.MouseEvent, animeId: number) => {
      e.stopPropagation();
      e.preventDefault();
  
      const existingFavorite = currentUserFavorites.find(
        (fav: any) => fav.id === animeId
      );
  
      if (existingFavorite) {
        await removeFavorite(existingFavorite.id);
      } else {
        await addFavorite(animeId);
      }
    };
    const handleWatchlistClick = (e: React.MouseEvent, animeId: number) => {
      e.stopPropagation();
      e.preventDefault();
  
      const existingWatchlist = watchlist.find((wl: any) => wl.id === animeId);
      if (existingWatchlist) {
        removeFromWatchlist(existingWatchlist.id);
      } else {
        addToWatchlist(animeId);
      }
    };
     
  return (
    <div className="w-full p-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {animes.map((anime) => {
            const isFavorited = currentUserFavorites.some(
              (fav: any) => fav?.id === anime.id
            );
            const isInWatchlist = watchlist.some(
              (wl: any) => wl?.id === anime.id
            );
          return (
          <div
            key={anime.id}
            className="flex justify-center"
            onClick={() => navigate(`/anime/${anime.id}`)}
                  >
            <div className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px]">
              {/* Poster */}
              <div className="relative w-full aspect-3/4 overflow-hidden rounded-xl  shadow-md shadow-black/40">
                <img
                  src={anime.img_url_icon}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* Gradient overlay + title on hover */}
                   <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between px-2 pb-2">
                    
                      {/* BOTTOM LEFT: Title */}
                      <div>
                        <p className="text-sm font-bold text-white shadow-black drop-shadow-md sm:text-base line-clamp-2">
                          {anime.title}
                        </p>
                      </div>
                      {/* TOP RIGHT: Action Icons */}
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={(e) => handleFavoriteClick(e, anime.id)}
                          className="transition-transform hover:scale-110 active:scale-95"
                        >
                          <Heart
                            size={22}
                            className={`transition-colors drop-shadow-sm ${
                              isFavorited
                                ? "text-red-500 fill-red-500"
                                : "text-white hover:text-red-200"
                            }`}
                          />
                        </button>

                        <button
                            onClick={(e) => handleWatchlistClick(e, anime.id)}
                            className="transition-transform hover:scale-110 active:scale-95"
                          >
                          <Bookmark
                            size={22}
                            className={`cursor-pointer drop-shadow-sm ${
                              isInWatchlist
                                ? "text-blue-500 fill-blue-500"
                                : "text-white hover:text-blue-300"
                            }`}
                          />
                        </button>
                        
                      </div>

                    </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default AnimeFavWatch;
