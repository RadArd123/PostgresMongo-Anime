import type { Anime } from "@/interfaces/anime.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import { useFavoritesStore } from "@/store/favoritesStore";
import { useEffect } from "react";
import { useWatchlistStore } from "@/store/watchlistStore";
import BlurText from "./BlurText";
import AnimeCard from "./AnimeCard";

const AnimeCards = ({ title, animes }: { title: string; animes: Anime[] }) => {
  const { currentUserFavorites, fetchFavorites } = useFavoritesStore();
  const { watchlist, fetchWatchlist } = useWatchlistStore();
  
  useEffect(() => {

    fetchFavorites();
  }, [currentUserFavorites.length]);

  useEffect(() => {
 
    fetchWatchlist();
  }, [watchlist.length]);


  return (
    <div className="w-full p-0 m-0">
      <div className="border-l-4 border-blue-700 pl-4 mb-6">
        <BlurText
          text={title}
          className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold leading-none heading-font"
          delay={50}
          animateBy="letters"
          direction="top"
          animationFrom={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animationTo={[{ opacity: 1, filter: 'blur(0px)', y: 0 }]}
          onAnimationComplete={() => {}}
        />
      </div>

      <Carousel
        opts={{ align: "start" }}
        className="w-full relative group/buttons  "
      >
        <CarouselContent className="w-full overflow-x-scroll hide-scrollbar cursor-grab select-none ">
          {animes.map((anime) => (
              <CarouselItem
                key={anime.id}
                className="basis-[150px] sm:basis-[170px] md:basis-1/4 lg:basis-1/5 flex ml-2"
              >
                <div className="w-full">
                  <AnimeCard anime={anime} />
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 hidden group-hover/buttons:flex" />
        <CarouselNext className="right-1 hidden group-hover/buttons:flex " />
      </Carousel>
    </div>
  );
};

export default AnimeCards;
