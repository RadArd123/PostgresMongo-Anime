import type { Anime } from "@/interfaces/anime.types";
import type { Episode } from "@/interfaces/episodes.types";
import { ScrollArea } from "../ui/scroll-area";
import { Play, Film, Tv } from "lucide-react";
import { motion } from "framer-motion";

interface EpisodesCardProps {
  episodesById: Episode[];
  anime?: Anime;
  onEpisodeClick?: (episode: Episode) => void;
}

const EpisodesCard = ({ episodesById, onEpisodeClick, anime }: EpisodesCardProps) => {
  return (
    <section className="w-full h-full mb-12 px-4 sm:px-6 py-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 font-mono flex items-center gap-1.5">
            <Tv size={14} /> STREAMING GUIDE
          </p>
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
            Available Episodes ({episodesById.length})
          </h1>
        </div>
        <span className="text-xs text-gray-400 font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10">
          HD Quality
        </span>
      </div>

      <ScrollArea className="h-[65vh] pr-4 py-2">
        {episodesById && episodesById.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {episodesById.map((ep, idx) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEpisodeClick?.(ep)}
                className="rounded-2xl overflow-hidden bg-[#12141a] border border-white/10 hover:border-blue-500/50 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all cursor-pointer group flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
                  <img
                    src={anime?.img_url_banner || anime?.img_url_icon || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop"}
                    alt={ep.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] via-transparent to-transparent" />

                  {/* Episode Number Pill */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-xs font-black text-white flex items-center gap-1">
                    <Film size={12} className="text-blue-400" />
                    <span>EP {ep.episode_number}</span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <div className="size-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.8)] transform group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col justify-between flex-1 bg-[#161821]">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {ep.title || `Episode ${ep.episode_number}`}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-gray-400 font-mono">
                    <span>{anime?.title || "Anime"}</span>
                    <span className="text-blue-400 group-hover:underline">Stream ►</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Film size={32} className="mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No episodes uploaded yet for this anime.</p>
          </div>
        )}
      </ScrollArea>
    </section>
  );
};

export default EpisodesCard;
