import EpisodesCard from "@/components/myComponents/EpisodesCard";
import ReviewsSection from "@/components/myComponents/ReviewsSection";


import { Button } from "@/components/ui/button";
import { useAnimeStore } from "@/store/animeStore";
import { useEpisodeStore } from "@/store/episodeStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AnimePage = () => {
  const { anime, getAnimeById } = useAnimeStore();
  const { episodesById, fetchEpisodesByAnimeId , resetEpisodes} = useEpisodeStore();
  const { id } = useParams();
  const navigate = useNavigate();

 useEffect(() => {
    if (id) {
      // 1. Încărcăm datele noi
      getAnimeById?.(Number(id));
      fetchEpisodesByAnimeId?.(Number(id));
    }

    // 2. Funcția de Cleanup (se execută când pleci de pe pagină sau se schimbă ID-ul)
    return () => {
      if (resetEpisodes) {
        resetEpisodes();
      }
    };
  }, [id, getAnimeById, fetchEpisodesByAnimeId, resetEpisodes]);

  if (!anime) {
    return (
      <div className="min-h-screen w-full bg-black text-slate-100 relative overflow-hidden">
        <p className="text-lg">Loading anime...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-black text-slate-100 flex flex-col ">
      <div className="absolute inset-0">
        <img
          src={anime?.img_url_banner}
          alt={anime?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
      </div>
      {/* Conținut */}
      <div className="relative z-10 flex flex-col items-center min-h-screen mt-[70vh] ">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-12 ">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-end">
            {/* Poster */}
            <div className="w-40 sm:w-48 lg:w-60 shrink-0 ">
              <div  className="rounded-2xl overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.7)] ">
                <img
                  src={anime.img_url_icon}
                  alt={anime.title}
                  className="w-full min-h-84 object-cover"
                />
              </div>
            </div>

            {/* Text + butoane */}
            <div className="flex-1 space-y-4 lg:space-y-6">
              <div>
                <h1 className="mb-1 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                  {anime.title}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-100/90">
                  {/* Genuri */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/15 px-4 py-1.5 text-xs sm:text-sm font-semibold text-yellow-300">
                    {anime.genre}
                  </div>
                </div>
              </div>

              {/* Descriere */}
              <p className="max-w-2xl text-sm sm:text-base text-zinc-100/90 leading-relaxed">
                {anime.description}
              </p>

              {/* Butoane */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="default"
                  className="
                    h-10 md:h-11 px-6 md:px-7 rounded-full
                    bg-linear-to-r from-blue-500 to-indigo-500
                    hover:from-blue-600 hover:to-indigo-600
                    text-neutral-100 font-extrabold
                    shadow-[0_3px_6px_rgba(37,99,235,0.7)]
                    hover:-translate-y-0.5
                    transition-all
                  "
                >
                  Start Episode 1
                </Button>

                <Button
                  variant="outline"
                  className="
                    h-10 md:h-11 px-5 rounded-full
                    border-white/25 bg-white/10 text-slate-100
                    hover:bg-white/15 hover:border-white/40
                  "
                >
                  + Adaugă în listă
                </Button>
              </div>
            </div>
          </div>
        </div>
          {/* Episodes & Reviews */}
        <section className="relative w-full mx-auto px-4 md:px-8 lg:px-35 mt-16 mb-20">
          <div className="rounded-3xl border border-white/10 bg-black/60 shadow-[0_25px_60px_rgba(0,0,0,0.45)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sky-200/70">
                  Episode guide
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Urmareste episoadele
                </h2>
                <p className="text-sm text-slate-200/80">
                  {episodesById?.length ?? 0} episoade disponibile pentru {anime.title}.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200/80">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-semibold text-sky-200">
                  {episodesById?.length ?? 0} episoade
                </span>
                <span className="hidden sm:inline text-slate-400">
                  Actualizam de fiecare data cand apare ceva nou
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-2 sm:p-3">
                <EpisodesCard
                  episodesById={episodesById}
                  anime={anime}
                  onEpisodeClick={(episode) => navigate(`/anime/episode/${episode.id}`)}
                />
              </div>

              <ReviewsSection anime={anime} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnimePage;
