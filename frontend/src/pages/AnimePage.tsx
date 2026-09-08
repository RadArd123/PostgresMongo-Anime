import EpisodesCard from "@/components/myComponents/EpisodesCard";
import ReviewsSection from "@/components/myComponents/ReviewsSection";
import SplitTextAnime from "@/components/myComponents/SplitTextAnime";
import BlurText from "@/components/myComponents/BlurText";
import { Button } from "@/components/ui/button";
import { useAnimeStore } from "@/store/animeStore";
import { useEpisodeStore } from "@/store/episodeStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useWatchlistStore } from "@/store/watchlistStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlayIcon, HeartIcon, BookmarkIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from '@/store/authStore';

const AnimePage = () => {
  const { anime, getAnimeById, error } = useAnimeStore();
  const authenticated = useAuthStore(state => state.isAuthenticated);
  const { episodesById, fetchEpisodesByAnimeId, resetEpisodes } = useEpisodeStore();
  const { currentUserFavorites, addFavorite, removeFavorite, fetchFavorites } = useFavoritesStore();
  const { watchlist, addToWatchlist, removeFromWatchlist, fetchWatchlist } = useWatchlistStore();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getAnimeById?.(Number(id));
      fetchEpisodesByAnimeId?.(Number(id));
      if (authenticated) { fetchFavorites(); fetchWatchlist(); }
    }
    return () => {
      if (resetEpisodes) {
        resetEpisodes();
      }
    };
  }, [id, authenticated, getAnimeById, fetchEpisodesByAnimeId, fetchFavorites, fetchWatchlist, resetEpisodes]);

  if (!anime || anime.id !== Number(id)) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-100 flex items-center justify-center">
        {error ? <div role="alert" className="text-center space-y-4"><p>Seria nu a putut fi încărcată.</p><Button onClick={() => getAnimeById(Number(id))}>Încearcă din nou</Button></div> : <div role="status" aria-label="Se încarcă seria" className="loader border-t-4 border-b-4 border-blue-500 w-12 h-12 rounded-full animate-spin" />}
      </div>
    );
  }

  const animeId = Number(id);
  const isFavorite = currentUserFavorites.some((fav: any) => fav.id === animeId);
  const isInWatchlist = watchlist.some((item: any) => item.id === animeId);

  const handleFavoriteClick = async () => {
    if (!authenticated) { navigate('/login'); return; }
    if (isFavorite) {
      const favObj = currentUserFavorites.find((fav: any) => fav.id === animeId);
      if (favObj) await removeFavorite(favObj.id);
    } else {
      await addFavorite(animeId);
    }
  };

  const handleWatchlistClick = async () => {
    if (!authenticated) { navigate('/login'); return; }
    if (isInWatchlist) {
      const watchObj = watchlist.find((item: any) => item.id === animeId);
      if (watchObj) await removeFromWatchlist(watchObj.id);
    } else {
      await addToWatchlist(animeId);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-slate-100 flex flex-col relative px-4 md:pl-[130px] lg:pl-[150px] md:pr-10">
      {/* Full Wallpaper Banner */}
      <div className="absolute top-0 left-0 right-0 h-[85vh] overflow-hidden pointer-events-none">
        <img
          src={anime?.img_url_banner || anime?.img_url_icon}
          alt={anime?.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
      </div>

      {/* Main Content Container (Pushed down so full wallpaper is visible) */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-8 mt-[62vh] pb-20 space-y-16">
        
        {/* Series Overview Box */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
          {/* Anime Poster Card */}
          <div className="w-48 sm:w-56 lg:w-64 shrink-0 mx-auto md:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/15 aspect-[3/4] bg-neutral-900">
              <img
                src={anime.img_url_icon}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text & Action Buttons */}
          <div className="flex-1 space-y-5 text-center md:text-left drop-shadow-lg">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-400">
                PREZENTARE GENERALĂ
              </span>
              <SplitTextAnime
                englishText={anime.title}
                japaneseText=""
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md"
                isActive={true}
              />

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                {anime.genre && anime.genre.split(",").map((g, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-blue-500/20 border border-blue-500/40 px-3.5 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="max-w-3xl">
              <BlurText
                text={anime.description}
                className="text-sm sm:text-base leading-relaxed text-gray-300"
                delay={10}
                animateBy="words"
                direction="bottom"
                animationFrom={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
                animationTo={[{ opacity: 1, filter: 'blur(0px)', y: 0 }]}
                onAnimationComplete={() => {}}
              />
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Button
                onClick={() => {
                  if (episodesById && episodesById.length > 0) {
                    navigate(`/anime/episode/${episodesById[0].id}`);
                  } else {
                    toast.info("Nu există niciun episod încărcat pentru acest anime.");
                  }
                }}
                className="h-11 px-7 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold shadow-[0_4px_15px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <PlayIcon size={16} className="fill-white" /> Începe Episodul 1
              </Button>

              <Button
                variant="outline"
                onClick={handleWatchlistClick}
                className={`h-11 px-5 rounded-full border transition-all flex items-center gap-2 ${
                  isInWatchlist
                    ? "bg-blue-500/20 border-blue-500 text-blue-400"
                    : "border-white/20 bg-white/5 text-gray-200 hover:bg-white/10"
                }`}
              >
                {isInWatchlist ? <CheckIcon size={16} /> : <BookmarkIcon size={16} />}
                {isInWatchlist ? "În Lista de Urmărire" : "Urmărește"}
              </Button>

              <Button
                variant="outline"
                onClick={handleFavoriteClick}
                className={`h-11 px-5 rounded-full border transition-all flex items-center gap-2 ${
                  isFavorite
                    ? "bg-red-500/20 border-red-500 text-red-400"
                    : "border-white/20 bg-white/5 text-gray-200 hover:bg-white/10"
                }`}
              >
                <HeartIcon size={16} className={isFavorite ? "fill-red-400" : ""} />
                {isFavorite ? "La Favorite" : "Adaugă la Favorite"}
              </Button>
            </div>
          </div>
        </div>

        {/* Episodes Guide Section & Reviews */}
        <div className="space-y-12 pt-6">
          <div className="rounded-3xl border border-white/10 bg-black/50 shadow-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr,1fr]">
              {/* Left: Episodes List */}
              <div className="rounded-2xl border border-white/10 bg-[#111318]/70 p-4">
                <EpisodesCard
                  episodesById={episodesById}
                  anime={anime}
                  onEpisodeClick={(episode) => navigate(`/anime/episode/${episode.id}`)}
                />
              </div>

              {/* Right: Reviews */}
              <div className="rounded-2xl border border-white/10 bg-[#111318]/70 p-4">
                <ReviewsSection anime={anime} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnimePage;
