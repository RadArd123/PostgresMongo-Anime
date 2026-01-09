import type { Anime } from "@/interfaces/anime.types";
import { ScrollArea } from "../ui/scroll-area";

const AnimeAdmin = ({ animes }: { animes: Anime[] }) => {
  return (
    <div className="w-full p-3">
      <ScrollArea className="h-[80vh]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {animes.map((anime) => (
          <div
            key={anime.id}
            className="flex justify-center"
          >
            <div className="group w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px]">
              {/* Poster */}
              <div className="w-full aspect-3/4 overflow-hidden rounded-xl relative shadow-md shadow-black/40">
                <img
                  src={anime.img_url_icon}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Gradient overlay + title on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                  <div className="p-3 w-full">
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-white line-clamp-2 text-center">
                      {anime.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </ScrollArea>
    </div>
  );
};

export default AnimeAdmin;
