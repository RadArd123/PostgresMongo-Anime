import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogTrigger,} from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";
import {Select, SelectContent, SelectItem, SelectTrigger,SelectValue,} from "../ui/select";
import type { Anime } from "@/interfaces/anime.types";
import { useEpisodeStore } from "@/store/episodeStore";






const DialogAddEpisode = ({animes}: {animes: Anime[]}) => {
  const [animeId, setAnimeId] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const { createEpisode, isLoading} = useEpisodeStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const episodeData = {anime_id: Number(animeId), title, duration: Number(duration), episode_number: Number(episodeNumber), video_url: videoUrl};
      await createEpisode?.(episodeData);
      setAnimeId("");
      setTitle("");
      setDuration("");
      setEpisodeNumber("");
      setVideoUrl("");
    }catch (error) {
      console.error("Failed to create episode:", error);
    }
  
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionCard
          title="Add Episode"
          subtitle="Upload a new episode to an anime series"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-linear-to-b from-black via-slate-950 to-black text-white rounded-2xl shadow-2xl border border-blue-500/30 p-4 sm:p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Add Episode
            </DialogTitle>
            <p className="text-sm text-slate-400">
              Fill in the details below to add a new episode.
            </p>
          </DialogHeader>

          {/* Episode info card */}
          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl backdrop-blur">
            <CardContent className="p-3 pb-0 grid gap-4 sm:grid-cols-2">
              {/* Anime select (sets anime_id) */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="anime_id"
                  className="text-sm font-medium text-slate-100"
                >
                  Anime <span className="text-blue-400">*</span>
                </label>
                <Select
                  value={animeId}
                  onValueChange={(value) => setAnimeId(value)}
                >
                  <SelectTrigger className="bg-slate-900/70 border border-slate-700/60 text-white rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500">
                    <SelectValue placeholder="Select anime" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-slate-700/60 text-white">
                    {animes.map((anime) => (
                      <SelectItem key={anime.id} value={String(anime.id)}>
                        {anime.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400">
                  The selected anime’s ID will be used as <code>anime_id</code>.
                </p>
              </div>

              {/* anime_id input (read-only, auto-filled) */}
              <div className="space-y-2">
                <label
                  htmlFor="anime_id"
                  className="text-sm font-medium text-slate-100"
                >
                  Anime ID
                </label>
                <Input
                  id="anime_id"
                  name="anime_id"
                  value={animeId}
                  readOnly
                  placeholder="Select an anime above"
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                />
              </div>

              {/* title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-100"
                >
                  Episode Title <span className="text-blue-400">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Episode 1: The Beginning"
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                />
              </div>

              {/* duration */}
              <div className="space-y-2">
                <label
                  htmlFor="duration"
                  className="text-sm font-medium text-slate-100"
                >
                  Duration
                </label>
                <Input
                  id="duration"
                  name="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="24:00"
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                />
              </div>

              {/* episode_number */}
              <div className="space-y-2">
                <label
                  htmlFor="episode_number"
                  className="text-sm font-medium text-slate-100"
                >
                  Episode Number
                </label>
                <Input
                  id="episode_number"
                  name="episode_number"
                  type="number"
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(e.target.value)}
                  placeholder="1"
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                />
              </div>

              {/* video_url */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="video_url"
                  className="text-sm font-medium text-slate-100"
                >
                  Video URL <span className="text-blue-400">*</span>
                </label>
                <Input
                  id="video_url"
                  name="video_url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://cdn.example.com/anime/episode-1.mp4"
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1 pb-1">
            <Button
              type="button"
              variant="outline"
              className="border-slate-600/70 text-slate-200 bg-transparent hover:bg-slate-800/80 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/30 hover:bg-blue-600"
            >{isLoading ? "Saving..." : "Save Episode"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddEpisode;
