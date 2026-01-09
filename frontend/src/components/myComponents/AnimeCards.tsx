import type { Anime } from "@/interfaces/anime.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useNavigate } from "react-router-dom";
import { Bookmark, Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useEffect } from "react";
import { useWatchlistStore } from "@/store/watchlistStore";

const AnimeCards = ({ title, animes }: { title: string; animes: Anime[] }) => {
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

    const navigate = useNavigate();

  return (
    <div className="w-full p-0 m-0">
      <div className="border-l-4 border-blue-700 pl-4 mb-6">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold leading-none">
          {title}
        </h1>
      </div>

      <Carousel
        opts={{ align: "start" }}
        className="w-full relative group/buttons  "
      >
        <CarouselContent className="w-full overflow-x-scroll hide-scrollbar cursor-grab select-none ">
          {animes.map((anime) => {
            const isFavorited = currentUserFavorites.some(
              (fav: any) => fav?.id === anime.id
            );
            const isInWatchlist = watchlist.some(
              (wl: any) => wl?.id === anime.id
            );
            return (
              <CarouselItem
                key={anime.id}
                className="basis-auto sm:basis-1/3 md:basis-1/4 lg:basis-1/5 flex ml-2"
              >
                <div className="flex flex-col items-center w-[150px] sm:w-[170px] md:w-[300px] mx-auto">
                  {/* Poster */}
                  <div
                    className="w-full aspect-3/4 overflow-hidden rounded-xl relative group shadow-md shadow-black/40 group-hover:border-blue-500 "
                    onClick={() => navigate(`/anime/${anime.id}`)}
                  >
                    <img
                      src={anime.img_url_icon}
                      alt={anime.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 "
                    />

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
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-1 hidden group-hover/buttons:flex" />
        <CarouselNext className="right-1 hidden group-hover/buttons:flex " />
      </Carousel>
    </div>
  );
};

export default AnimeCards;
