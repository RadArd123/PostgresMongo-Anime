import type { Anime } from "@/interfaces/anime.types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useWatchlistStore } from "@/store/watchlistStore";

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addFavorite, removeFavorite, currentUserFavorites } = useFavoritesStore();
  const { addToWatchlist, removeFromWatchlist, watchlist } = useWatchlistStore();

  const isFavorited = currentUserFavorites.some(
    (fav: any) => fav?.id === anime.id
  );
  const isInWatchlist = watchlist.some(
    (wl: any) => wl?.id === anime.id
  );

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
    <div className="flex flex-col items-center w-full max-w-[300px] mx-auto">
      {/* Poster */}
      <div
        className="w-full aspect-3/4 overflow-hidden rounded-xl relative group shadow-md shadow-black/40 group-hover:border-blue-500 cursor-pointer"
        onClick={() => navigate(`/anime/${anime.id}`)}
      >
        {/* Skeleton placeholder */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-800/80 animate-pulse rounded-xl" />
        )}
        
        <img
          src={anime.img_url_icon}
          alt={anime.title}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isImageLoaded ? 'opacity-100 blur-none' : 'opacity-0 blur-md'}`}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between px-2 pb-2">
          {/* BOTTOM LEFT: Title */}
          <div className="flex-1 pr-2">
            <p className="text-sm font-bold text-white shadow-black drop-shadow-md sm:text-base line-clamp-2">
              {anime.title}
            </p>
          </div>
          {/* TOP RIGHT: Action Icons */}
          <div className="flex justify-end gap-3 pb-1">
            <button
              onClick={(e) => handleFavoriteClick(e, anime.id)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <HeartIcon
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
              <BookmarkIcon
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
  );
};

export default AnimeCard;
