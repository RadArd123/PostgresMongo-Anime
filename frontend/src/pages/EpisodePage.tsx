import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useEpisodeStore } from "@/store/episodeStore";

const EpisodePage = () => {
  const { id } = useParams();
  const { currentEpisode, getEpisodeById, episodesById, fetchEpisodesByAnimeId } = useEpisodeStore();

  // 1️⃣ Obține episodul curent
  useEffect(() => {
    if (id && getEpisodeById) getEpisodeById(Number(id));
  }, [id, getEpisodeById]);

  // 2️⃣ După ce episodul curent e încărcat, obține lista episoadele anime-ului respectiv
  useEffect(() => {
    if (currentEpisode?.anime_id && fetchEpisodesByAnimeId) {
      fetchEpisodesByAnimeId(currentEpisode.anime_id);
    }
  }, [currentEpisode, fetchEpisodesByAnimeId]);

  if (!currentEpisode) {
    return (
      <div className="min-h-screen w-full bg-black text-slate-100 flex items-center justify-center">
        Loading episode...
      </div>
    );
  }

  return (
   
    <div className="min-h-screen w-full bg-black text-slate-100 p-4 flex flex-col items-center">
      
     
      <div className="w-full max-w-5xl">
        
      
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
            {currentEpisode.title}
        </h1>

        <div className="relative w-full pt-[56.25%] overflow-hidden rounded-xl shadow-lg shadow-blue-900/20 mb-8 border border-slate-800">
          <iframe
            src={currentEpisode.video_url}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        <div className="w-full h-px bg-slate-800 mb-8"></div>

        <h2 className="text-xl font-semibold mb-4 text-blue-400">Alte episoade</h2>
        {!episodesById?.length ? (
          <div className="flex items-center justify-center h-32">
            <div className="loader border-t-4 border-b-4 border-blue-500 w-10 h-10 rounded-full animate-spin"></div>
          </div>
        ) : (
  
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {episodesById.map((ep) => (
              <Link
                key={ep.id}
                to={`/anime/episode/${ep.id}`}
                className={`group p-3 rounded-lg border transition-all duration-200 ${
                  ep.id === currentEpisode.id 
                    ? "border-blue-500 bg-blue-900/20" 
                    : "border-slate-800 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                }`}
              >
                <div className="text-sm font-medium truncate group-hover:text-blue-300">
                    {ep.title || `Episodul ${ep.episode_number}`}
                </div>
                <p className="text-xs text-gray-500 mt-1">Episodul {ep.episode_number}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EpisodePage;