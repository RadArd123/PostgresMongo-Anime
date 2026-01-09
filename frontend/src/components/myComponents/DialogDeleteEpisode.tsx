import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {Dialog, DialogContent,  DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import ActionCard from "./ActionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Episode } from "@/interfaces/episodes.types";
import { useEpisodeStore } from "@/store/episodeStore";
import type { Anime } from "@/interfaces/anime.types";
import { Input } from "../ui/input";


interface DialogDeleteEpisodeProps {
  episodes: Episode[];
  animes: Anime[];
  onFetchEpisodes?: (animeId: number) => void;
  resetEpisodes?: () => void;
}

const DialogDeleteEpisode = ({ episodes, animes, onFetchEpisodes, resetEpisodes }: DialogDeleteEpisodeProps) => {
  
  const {deleteEpisode, isLoading } = useEpisodeStore();

  const [animeId, setAnimeId] = useState("");
  const [episodeId, setEpisodeId] = useState("");

  const handleAnimeChange = (value: string) => {
    setAnimeId(value);
    setEpisodeId("");
    if(value && onFetchEpisodes){
      onFetchEpisodes(Number(value));
    }
    if(resetEpisodes){
      resetEpisodes();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try{
        if(episodeId && deleteEpisode){
      await deleteEpisode(Number(episodeId));
        setEpisodeId("");
        }
 
    } catch (error) {
      console.error("Failed to delete episode:", error);
    }
    };

    return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionCard
          title="Delete Episode"
          subtitle="Delete an existing episode"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-linear-to-b from-black via-slate-950 to-black text-white rounded-2xl shadow-2xl border border-blue-500/30 p-4 sm:p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Delete Episode
            </DialogTitle>
            <p className="text-sm text-slate-400">
              Select an episode below to delete it.
            </p>
          </DialogHeader>

          {/* Episode info card */}
          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl backdrop-blur">
            <CardContent className="p-3 pb-0 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="anime_id"
                  className="text-sm font-medium text-slate-100"
                >
                  Anime <span className="text-blue-400">*</span>
                </label>
                <Select
                  value={animeId}
                    onValueChange={handleAnimeChange}
                >
                  <SelectTrigger className="bg-slate-900/70 border border-slate-700/60 text-white rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500">
                    <SelectValue placeholder="Select anime" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-slate-700/60 text-white">
                    {animes?.map((anime) => (
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
              {/* Anime select (sets anime_id) */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="anime_id"
                  className="text-sm font-medium text-slate-100"
                >
                 Episode <span className="text-blue-400">*</span>
                </label>
                <Select
                  value={episodeId}
                  onValueChange={(value) => setEpisodeId(value)}
                >
                  <SelectTrigger className="bg-slate-900/70 border border-slate-700/60 text-white rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500">
                    <SelectValue placeholder="Select episode" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-slate-700/60 text-white">
                    {episodes.map((episode  ) => (
                      <SelectItem key={episode.id} value={String(episode.id)}>
                        Episode {episode.episode_number}: {episode.title}
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
                  htmlFor="episode_id"
                  className="text-sm font-medium text-slate-100"
                >
                  Episode ID
                </label>
                <input
                  id="episode_id"
                  name="episode_id"
                  value={episodeId}
                  readOnly
                  placeholder="Select an episode above"
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 px-3 py-2 w-full"
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
            >{isLoading ? "Deleting..." : "Delete Episode"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteEpisode;