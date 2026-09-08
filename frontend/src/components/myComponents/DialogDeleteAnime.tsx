import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";
import { useAnimeStore } from "@/store/animeStore";
import type { Anime } from "@/interfaces/anime.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Trash2Icon } from "lucide-react";

const DialogDeleteAnime = ({ animes }: { animes: Anime[] }) => {
  const { deleteAnime, isLoading } = useAnimeStore();
  const [animeId, setAnimeId] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deleteAnime(Number(animeId));
      setAnimeId("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete anime:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Delete Anime"
          subtitle="Delete an existing anime series"
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
                Delete Anime
                </DialogTitle>
                <p className="text-sm text-slate-400 mt-1">
                Select an anime to permanently remove it.
                </p>
            </div>
          </DialogHeader>

          {/* Selection card */}
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="anime_id_select" className="text-sm font-medium text-slate-300">
                  Anime <span className="text-red-400">*</span>
                </label>
                <Select value={animeId} onValueChange={(value) => setAnimeId(value)}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-0 focus-visible:border-red-500 hover:border-red-500/50">
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

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="anime_id" className="text-sm font-medium text-slate-300">
                  Anime ID
                </label>
                <Input
                  id="anime_id"
                  name="anime_id"
                  value={animeId}
                  readOnly
                  placeholder="Select an anime above"
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
              disabled={isLoading || !animeId}
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-500 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Deleting..." : "Delete Anime"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteAnime;