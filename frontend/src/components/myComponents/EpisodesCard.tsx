import type { Anime } from "@/interfaces/anime.types";
import type { Episode } from "@/interfaces/episodes.types";
import { ScrollArea } from "../ui/scroll-area";

interface EpisodesCardProps {
  episodesById: Episode[];
  anime?: Anime;
  onEpisodeClick?: (episode: Episode) => void;
}

const EpisodesCard = ({ episodesById, onEpisodeClick, anime }: EpisodesCardProps) => {
  return (
    <section className="w-full h-full mb-20  px-6 py-8">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Watch next
          </p>
          <h1 className="mt-1 text-white text-3xl font-bold tracking-tight ">
            Episodes
          </h1>
        </div>
      </div>

      <ScrollArea className="h-[80vh] pr-6">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 sm:gap-5 ">
          {episodesById.map((episode) => (
            <button
              key={episode.id}
              type="button"
              onClick={() => onEpisodeClick?.(episode)}
              className="group text-left focus:outline-none focus-visible:ring-2 rounded-2xl p-2 "
            >
              <div className="rounded-2xl overflow-hidden ring-1 ring-slate-800/60 transition hover:shadow-lg hover:ring-slate-700 h-[280px]">
                {/* Thumbnail */}
                <div className="relative aspect-video w-full ">
                  {/* Image */}
                  <img
                    src={anime?.img_url_icon}
                    alt={episode.title}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Play overlay on hover */}
                  <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-white/95 shadow-xl shadow-black/60">
                      <span className="ml-0.5 text-base font-semibold text-slate-900">▶</span>
                    </div>
                  </div>

                  {/* Ep badge (top-left) */}
                  <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-100 ring-1 ring-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    EP {episode.episode_number}
                  </div>

                  {/* Duration (bottom-right) */}
                  {episode.duration && (
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/70 backdrop-blur px-2 py-0.5 text-[0.7rem] font-semibold text-slate-100 ring-1 ring-white/10">
                      {episode.duration}m
                    </div>
                  )}
                </div>

                {/* Text under thumbnail */}
                <div className="relative p-3">
                  <p className="text-[0.7rem] uppercase tracking-wider text-slate-400">
                    {anime?.title ?? "ANIME"}
                  </p>

                  <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-50 group-hover:text-sky-100">
                    S1 E{episode.episode_number} — {episode.title}
                  </h2>

                  {/* subtle meta row */}
                  <div className="absolute top-25 right-2 mt-2 flex items-center gap-2 text-[0.7rem] text-slate-400 p-2">
                    {episode.duration && <span>{episode.duration}m</span>}
                    <span className="h-1 w-1 rounded-full bg-slate-600/70" />
                    <span>Episode {episode.episode_number}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
};

export default EpisodesCard;
