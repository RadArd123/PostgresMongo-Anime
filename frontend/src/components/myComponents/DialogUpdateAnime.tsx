import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";
import { useAnimeStore } from "@/store/animeStore";
import { Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Anime } from "@/interfaces/anime.types";

const DialogUpdateAnime = ({ animes = [] }: { animes: Anime[] }) => {
  const { updateAnime, isLoading } = useAnimeStore();

  const [open, setOpen] = useState(false);
  const [selectedAnimeId, setSelectedAnimeId] = useState("");

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | "">("");
  const [description, setDescription] = useState("");

  // When selected anime changes, populate fields
  useEffect(() => {
    if (selectedAnimeId) {
      const animeToUpdate = animes.find(a => String(a.id) === selectedAnimeId);
      if (animeToUpdate) {
        setTitle(animeToUpdate.title || "");
        setGenre(animeToUpdate.genre || "");
        setReleaseYear(animeToUpdate.release_year || "");
        setDescription(animeToUpdate.description || "");
      }
    } else {
        setTitle("");
        setGenre("");
        setReleaseYear("");
        setDescription("");
    }
  }, [selectedAnimeId, animes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimeId) return;

    try {
      await updateAnime(Number(selectedAnimeId), {
          title,
          genre,
          release_year: releaseYear ? Number(releaseYear) : undefined,
          description
      });
      setSelectedAnimeId("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update anime:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Update Anime"
          subtitle="Modify details of an existing anime"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-slate-950/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="bg-amber-500/20 p-2 rounded-xl">
                <Edit className="w-6 h-6 text-amber-400" />
            </div>
            <div>
                <DialogTitle className="text-2xl font-bold text-white">
                Update Anime
                </DialogTitle>
                <p className="text-sm text-slate-400 mt-1">
                Select an anime to update its basic information.
                </p>
            </div>
          </DialogHeader>

          {/* Selection Card */}
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4">
                <div className="space-y-2">
                    <label htmlFor="select_anime" className="text-sm font-medium text-slate-300">
                    Select Anime <span className="text-amber-400">*</span>
                    </label>
                    <Select
                        value={selectedAnimeId}
                        onValueChange={(value) => setSelectedAnimeId(value)}
                    >
                    <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-0 focus-visible:border-amber-500 hover:border-amber-500/50">
                        <SelectValue placeholder="Choose an anime to update" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-slate-700 text-white max-h-60">
                        {animes.map((anime) => (
                        <SelectItem key={anime.id} value={String(anime.id)}>
                            {anime.title}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </CardContent>
          </Card>

          {/* Basic info card (visible only if anime is selected) */}
          {selectedAnimeId && (
            <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
                <CardContent className="p-4 grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-slate-300">
                    Title <span className="text-amber-400">*</span>
                    </label>
                    <Input
                    id="title"
                    name="title"
                    placeholder="My Hero Academia"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="genre" className="text-sm font-medium text-slate-300">
                    Genre
                    </label>
                    <Input
                    id="genre"
                    name="genre"
                    placeholder="Action, Fantasy"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="release_year" className="text-sm font-medium text-slate-300">
                    Release Year
                    </label>
                    <Input
                    id="release_year"
                    name="release_year"
                    type="number"
                    placeholder="2013"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(Number(e.target.value))}
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                    />
                </div>

                <div className="space-y-2 sm:col-span-3">
                    <label htmlFor="description" className="text-sm font-medium text-slate-300">
                    Description
                    </label>
                    <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Short synopsis or your thoughts..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50 resize-none"
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
              disabled={isLoading || !selectedAnimeId}
              className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Anime"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpdateAnime;
