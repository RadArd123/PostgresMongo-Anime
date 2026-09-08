import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import ActionCard from "./ActionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Episode } from "@/interfaces/episodes.types";
import { useEpisodeStore } from "@/store/episodeStore";
import type { Anime } from "@/interfaces/anime.types";
import { Input } from "../ui/input";
import { EditIcon } from "lucide-react";

interface DialogUpdateEpisodeProps {
  episodes: Episode[];
  animes: Anime[];
  onFetchEpisodes?: (animeId: number) => void;
  resetEpisodes?: () => void;
}

const DialogUpdateEpisode = ({ episodes, animes, onFetchEpisodes, resetEpisodes }: DialogUpdateEpisodeProps) => {
  const { updateEpisode, isLoading } = useEpisodeStore();

  const [animeId, setAnimeId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleAnimeChange = (value: string) => {
    setAnimeId(value);
    setEpisodeId("");
    resetEpisodes?.();
    if (value && onFetchEpisodes) {
      onFetchEpisodes(Number(value));
    }
  };

  useEffect(() => {
    if (episodeId) {
      const ep = episodes.find(e => String(e.id) === episodeId);
      if (ep) {
        setTitle(ep.title || "");
        setDuration(ep.duration ? String(ep.duration) : "");
        setEpisodeNumber(ep.episode_number ? String(ep.episode_number) : "");
        setVideoUrl(ep.video_url || "");
      }
    } else {
        setTitle("");
        setDuration("");
        setEpisodeNumber("");
        setVideoUrl("");
    }
  }, [episodeId, episodes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (episodeId && updateEpisode) {
        await updateEpisode(Number(episodeId), {
            title,
            duration: duration ? Number(duration) : undefined,
            episode_number: episodeNumber ? Number(episodeNumber) : undefined,
            video_url: videoUrl
        });
        setEpisodeId("");
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to update episode:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Update Episode"
          subtitle="Modify details of an existing episode"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-screen overflow-y-auto bg-slate-950/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="bg-amber-500/20 p-2 rounded-xl">
                <EditIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
                <DialogTitle className="text-2xl font-bold text-white">
                Update Episode
                </DialogTitle>
                <p className="text-sm text-slate-400 mt-1">
                Select an episode below to modify it.
                </p>
            </div>
          </DialogHeader>

          {/* Selection card */}
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="anime_id" className="text-sm font-medium text-slate-300">
                  Anime <span className="text-amber-400">*</span>
                </label>
                <Select value={animeId} onValueChange={handleAnimeChange}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-0 focus-visible:border-amber-500 hover:border-amber-500/50">
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

              {/* Episode select */}
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="episode_id" className="text-sm font-medium text-slate-300">
                 Episode <span className="text-amber-400">*</span>
                </label>
                <Select value={episodeId} onValueChange={(value) => setEpisodeId(value)}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-0 focus-visible:border-amber-500 hover:border-amber-500/50" disabled={!animeId}>
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
              </div>
            </CardContent>
          </Card>
          
          {episodeId && (
            <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
                <CardContent className="p-4 grid gap-5 sm:grid-cols-2">
                    {/* title */}
                    <div className="space-y-2 sm:col-span-2">
                        <label htmlFor="title" className="text-sm font-medium text-slate-300">
                        Episode Title <span className="text-amber-400">*</span>
                        </label>
                        <Input
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Episode 1: The Beginning"
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                        />
                    </div>

                    {/* duration */}
                    <div className="space-y-2">
                        <label htmlFor="duration" className="text-sm font-medium text-slate-300">
                        Duration (Minutes)
                        </label>
                        <Input
                        id="duration"
                        name="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="24"
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                        />
                    </div>

                    {/* episode_number */}
                    <div className="space-y-2">
                        <label htmlFor="episode_number" className="text-sm font-medium text-slate-300">
                        Episode Number
                        </label>
                        <Input
                        id="episode_number"
                        name="episode_number"
                        type="number"
                        value={episodeNumber}
                        onChange={(e) => setEpisodeNumber(e.target.value)}
                        placeholder="1"
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                        />
                    </div>

                    {/* video_url */}
                    <div className="space-y-2 sm:col-span-2">
                        <label htmlFor="video_url" className="text-sm font-medium text-slate-300">
                        Video URL <span className="text-amber-400">*</span>
                        </label>
                        <Input
                        id="video_url"
                        name="video_url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://cdn.example.com/anime/episode-1.mp4"
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                        />
                    </div>
                </CardContent>
            </Card>
          )}

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
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Episode"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpdateEpisode;
