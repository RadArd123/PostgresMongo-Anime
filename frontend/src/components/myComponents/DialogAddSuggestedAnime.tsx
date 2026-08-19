import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";

import { useSuggestedAnimeStore } from "@/store/suggestedAnimeStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Anime } from "@/interfaces/anime.types";
import { ScrollArea } from "../ui/scroll-area";

const DialogAddSuggestedAnime = ({animes= []}: {animes: Anime[]}) => {
  const { addSuggestedAnime, isLoading } = useSuggestedAnimeStore();
  const [open, setOpen] = useState(false);

  const [postgresAnimeId, setPostgresAnimeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [viewsCount, setViewsCount] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [badgeLabel, setBadgeLabel] = useState("Trending");
  const [posterImage, setPosterImage] = useState<File | "">("");

  // Automatically update title and description if an anime is selected
  const handleSelectAnime = (val: string) => {
    setPostgresAnimeId(val);
    const selectedAnime = animes.find(a => String(a.id) === val);
    if(selectedAnime){
        setTitle(selectedAnime.title ?? "");
        setDescription(selectedAnime.description ?? "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("postgres_anime_id", postgresAnimeId);
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (viewsCount) formData.append("views_count", viewsCount);
    if (rating) formData.append("rating", rating.toString());
    formData.append("badge_label", badgeLabel);
    if (posterImage) formData.append("poster_image", posterImage);

    try {
      await addSuggestedAnime(formData as any);

      setTitle("");
      setDescription("");
      setViewsCount("");
      setPostgresAnimeId("");
      setRating("");
      setBadgeLabel("Trending");
      setPosterImage("");
      setOpen(false); 
    } catch (error) {
      console.error("Failed to create suggested anime:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Add Suggested Anime"
          subtitle="Recommend an anime in the trending list"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto bg-linear-to-b from-black via-slate-950 to-black text-white rounded-2xl shadow-2xl border border-blue-500/30 p-4 sm:p-6">
      <ScrollArea className="max-h-[90vh]">
        <form className="space-y-5 pr-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Add Suggested Anime
            </DialogTitle>
          </DialogHeader>

          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl">
            <CardContent className="pt-4 grid gap-4 sm:grid-cols-2">
              
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-slate-100">
                  Select Anime (Links to Postgres) <span className="text-blue-400">*</span>
                </label>
                <Select
                  value={postgresAnimeId}
                  onValueChange={handleSelectAnime}
                >
                  <SelectTrigger className="bg-slate-900/70 border border-slate-700/60 text-white rounded-xl">
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
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-slate-100">
                  Display Title <span className="text-blue-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Demon Slayer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-slate-900/70 border border-slate-700/60 text-white rounded-lg"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-slate-100">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-700/60 text-white rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">
                  Rating
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="bg-slate-900/70 border border-slate-700/60 text-white rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">
                  Views Count Text
                </label>
                <Input
                  placeholder="e.g. 1.2M Views"
                  value={viewsCount}
                  onChange={(e) => setViewsCount(e.target.value)}
                  className="bg-slate-900/70 border border-slate-700/60 text-white rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-100">
                  Badge Label
                </label>
                <Input
                  placeholder="e.g. Trending"
                  value={badgeLabel}
                  onChange={(e) => setBadgeLabel(e.target.value)}
                  className="bg-slate-900/70 border border-slate-700/60 text-white rounded-lg"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-slate-100">
                  Poster Image <span className="text-blue-400">*</span>
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setPosterImage(e.target.files ? e.target.files[0] : "")
                  }
                  className="cursor-pointer bg-slate-900/70 border border-slate-700/60 text-white rounded-lg file:mr-3 file:rounded-lg file:bg-blue-500 file:text-slate-950 file:border-0 hover:file:bg-blue-600"
                />
              </div>

            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-1 pb-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600/70 text-slate-200 bg-transparent hover:bg-slate-800/80 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/30 hover:bg-blue-600"
            >
              {isLoading ? "Saving..." : "Add Suggested Anime"}
            </Button>
          </div>
        </form>
         </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddSuggestedAnime;
