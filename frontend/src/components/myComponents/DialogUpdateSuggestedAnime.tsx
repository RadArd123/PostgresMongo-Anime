import { useState, useEffect } from "react";
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
import { EditIcon } from "lucide-react";
import type { ISuggestedAnime } from "@/interfaces/suggestedAnime.types";

const DialogUpdateSuggestedAnime = ({ animes = [], suggestedAnimes = [] }: { animes: Anime[], suggestedAnimes: ISuggestedAnime[] }) => {
  const { updateSuggestedAnime, isLoading } = useSuggestedAnimeStore();
  const [open, setOpen] = useState(false);

  const [selectedSuggestedId, setSelectedSuggestedId] = useState("");
  const [postgresAnimeId, setPostgresAnimeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [viewsCount, setViewsCount] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [badgeLabel, setBadgeLabel] = useState("Trending");

  useEffect(() => {
    if (selectedSuggestedId) {
        const item = suggestedAnimes.find(s => String(s.id) === selectedSuggestedId);
        if (item) {
            setPostgresAnimeId(String(item.postgres_anime_id));
            setTitle(item.title);
            setDescription(item.description || "");
            setViewsCount(item.views_count || "");
            setRating(item.rating ?? "");
            setBadgeLabel(item.badge_label || "Trending");
        }
    } else {
        setPostgresAnimeId("");
        setTitle("");
        setDescription("");
        setViewsCount("");
        setRating("");
        setBadgeLabel("Trending");
    }
  }, [selectedSuggestedId, suggestedAnimes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuggestedId) return;

    try {
      await updateSuggestedAnime(Number(selectedSuggestedId), {
          postgres_anime_id: Number(postgresAnimeId),
          title,
          description,
          views_count: viewsCount,
          rating: rating !== "" ? Number(rating) : undefined,
          badge_label: badgeLabel
      });
      setSelectedSuggestedId("");
      setOpen(false); 
    } catch (error) {
      console.error("Failed to update suggested anime:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Update Suggested Anime"
          subtitle="Modify details of an existing suggested anime"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto bg-slate-950/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
      <ScrollArea className="max-h-[90vh]">
        <form className="space-y-5 pr-4" onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
            <div className="bg-amber-500/20 p-2 rounded-xl">
                <EditIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
                <DialogTitle className="text-2xl font-bold text-white">
                Update Suggested Anime
                </DialogTitle>
                <p className="text-sm text-slate-400 mt-1">
                Select a suggested anime to update its details.
                </p>
            </div>
          </DialogHeader>

          {/* Selection Card */}
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4">
                <div className="space-y-2">
                    <label htmlFor="select_suggested" className="text-sm font-medium text-slate-300">
                    Select Suggested Anime <span className="text-amber-400">*</span>
                    </label>
                    <Select
                        value={selectedSuggestedId}
                        onValueChange={(value) => setSelectedSuggestedId(value)}
                    >
                    <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-0 focus-visible:border-amber-500 hover:border-amber-500/50">
                        <SelectValue placeholder="Choose a suggested anime to update" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-slate-700 text-white max-h-60">
                        {suggestedAnimes.map((suggested) => (
                        <SelectItem key={suggested.id} value={String(suggested.id)}>
                            {suggested.title}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </CardContent>
          </Card>

          {selectedSuggestedId && (
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4 grid gap-4 sm:grid-cols-2">
              
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-slate-100">
                  Select Anime (Links to Postgres) <span className="text-amber-400">*</span>
                </label>
                <Select
                  value={postgresAnimeId}
                  onValueChange={setPostgresAnimeId}
                >
                  <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-0 focus-visible:border-amber-500 hover:border-amber-500/50">
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
                  Display Title <span className="text-amber-400">*</span>
                </label>
                <Input
                  placeholder="e.g. Demon Slayer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
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
                  className="w-full bg-black/40 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50 resize-none"
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
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
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
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
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
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                />
              </div>

            </CardContent>
          </Card>
          )}

          <div className="flex items-center justify-end gap-3 pt-1 pb-1">
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
              disabled={isLoading || !selectedSuggestedId}
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Suggested Anime"}
            </Button>
          </div>
        </form>
         </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpdateSuggestedAnime;
