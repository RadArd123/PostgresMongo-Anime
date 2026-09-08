import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Anime } from "@/interfaces/anime.types";
import { useEpisodeStore } from "@/store/episodeStore";
import { PlayCircleIcon } from "lucide-react";

const DialogAddEpisode = ({ animes }: { animes: Anime[] }) => {
  const [animeId, setAnimeId] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [open, setOpen] = useState(false);

  const { createEpisode, isLoading } = useEpisodeStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const episodeData = { anime_id: Number(animeId), title, duration: Number(duration), episode_number: Number(episodeNumber), video_url: videoUrl };
      await createEpisode?.(episodeData);
      setAnimeId("");
      setTitle("");
      setDuration("");
      setEpisodeNumber("");
      setVideoUrl("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create episode:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Add Episode"
          subtitle="Upload a new episode to an anime series"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-slate-950/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="bg-blue-500/20 p-2 rounded-xl">
                <PlayCircleIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
                <DialogTitle className="text-2xl font-bold text-white">
                Add Episode
                </DialogTitle>
                <p className="text-sm text-slate-400 mt-1">
                Fill in the details below to add a new episode.
                </p>
            </div>
          </DialogHeader>

          {/* Episode info card */}
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4 grid gap-5 sm:grid-cols-2">
              {/* Anime select (sets anime_id) */}
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="anime_id" className="text-sm font-medium text-slate-300">
                  Anime <span className="text-blue-400">*</span>
                </label>
                <Select value={animeId} onValueChange={(value) => setAnimeId(value)}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0 focus-visible:border-blue-500 hover:border-blue-500/50">
                    <SelectValue placeholder="Select anime" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-slate-700 text-white">
                    {animes.map((anime) => (
                      <SelectItem key={anime.id} value={String(anime.id)}>
                        {anime.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  The selected anime’s ID will be used as <code>anime_id</code>.
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

              {/* title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-300">
                  Episode Title <span className="text-blue-400">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Episode 1: The Beginning"
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
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
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
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
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
                />
              </div>

              {/* video_url */}
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="video_url" className="text-sm font-medium text-slate-300">
                  Video URL <span className="text-blue-400">*</span>
                </label>
                <Input
                  id="video_url"
                  name="video_url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://cdn.example.com/anime/episode-1.mp4"
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
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
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              {isLoading ? "Saving..." : "Save Episode"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddEpisode;
