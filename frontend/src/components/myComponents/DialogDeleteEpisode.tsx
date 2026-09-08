import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import ActionCard from "./ActionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Episode } from "@/interfaces/episodes.types";
import { useEpisodeStore } from "@/store/episodeStore";
import type { Anime } from "@/interfaces/anime.types";
import { Input } from "../ui/input";
import { Trash2Icon } from "lucide-react";

interface DialogDeleteEpisodeProps {
  episodes: Episode[];
  animes: Anime[];
  onFetchEpisodes?: (animeId: number) => void;
  resetEpisodes?: () => void;
}

const DialogDeleteEpisode = ({ episodes, animes, onFetchEpisodes, resetEpisodes }: DialogDeleteEpisodeProps) => {
  const { deleteEpisode, isLoading } = useEpisodeStore();

  const [animeId, setAnimeId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [open, setOpen] = useState(false);

  const handleAnimeChange = (value: string) => {
    setAnimeId(value);
    setEpisodeId("");
    resetEpisodes?.();
    if (value && onFetchEpisodes) {
      onFetchEpisodes(Number(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (episodeId && deleteEpisode) {
        await deleteEpisode(Number(episodeId));
        setEpisodeId("");
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete episode:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Delete Episode"
          subtitle="Delete an existing episode"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-screen overflow-y-auto bg-slate-950/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="bg-red-500/20 p-2 rounded-xl">
                <Trash2Icon className="w-6 h-6 text-red-400" />
            </div>
            <div>
                <DialogTitle className="text-2xl font-bold text-white">
                Delete Episode
                </DialogTitle>
                <p className="text-sm text-slate-400 mt-1">
                Select an episode below to delete it.
                </p>
            </div>
          </DialogHeader>

          {/* Selection card */}
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="anime_id" className="text-sm font-medium text-slate-300">
                  Anime <span className="text-red-400">*</span>
                </label>
                <Select value={animeId} onValueChange={handleAnimeChange}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-0 focus-visible:border-red-500 hover:border-red-500/50">
                    <SelectValue placeholder="Select anime" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-slate-700 text-white">
                    {animes?.map((anime) => (
                      <SelectItem key={anime.id} value={String(anime.id)}>
                        {anime.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  First, select the anime that contains the episode.
                </p>
              </div>

              {/* anime_id input (read-only, auto-filled) */}
              <div className="space-y-2">
                <label htmlFor="anime_id_display" className="text-sm font-medium text-slate-300">
                  Anime ID
                </label>
                <Input
                  id="anime_id_display"
                  value={animeId}
                  readOnly
                  placeholder="Select an anime above"
                  className="bg-black/20 border-white/5 text-slate-400 placeholder:text-slate-600 rounded-xl focus-visible:ring-0 cursor-not-allowed"
                />
              </div>

              {/* Episode select */}
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="episode_id" className="text-sm font-medium text-slate-300">
                 Episode <span className="text-red-400">*</span>
                </label>
                <Select value={episodeId} onValueChange={(value) => setEpisodeId(value)}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-0 focus-visible:border-red-500 hover:border-red-500/50" disabled={!animeId}>
                    <SelectValue placeholder="Select episode" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-slate-700 text-white">
                    {episodes.map((episode) => (
                      <SelectItem key={episode.id} value={String(episode.id)}>
                        Episode {episode.episode_number}: {episode.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Select the specific episode to remove.
                </p>
              </div>

              {/* episode_id input (read-only, auto-filled) */}
              <div className="space-y-2">
                <label htmlFor="episode_id_display" className="text-sm font-medium text-slate-300">
                  Episode ID
                </label>
                <Input
                  id="episode_id_display"
                  value={episodeId}
                  readOnly
                  placeholder="Select an episode above"
                  className="bg-black/20 border-white/5 text-slate-400 placeholder:text-slate-600 rounded-xl focus-visible:ring-0 cursor-not-allowed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !episodeId}
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-500 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Deleting..." : "Delete Episode"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteEpisode;
