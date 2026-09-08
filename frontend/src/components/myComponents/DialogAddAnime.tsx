import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";
import { useAnimeStore } from "@/store/animeStore";
import { PlusCircleIcon } from "lucide-react";

const DialogAddAnime = () => {
  const { createAnime, isLoading } = useAnimeStore();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [iconImage, setIconImage] = useState<File | "">("");
  const [bannerImage, setBannerImage] = useState<File | "">("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    if (releaseYear) formData.append("release_year", releaseYear.toString());
    formData.append("description", description);
    if (iconImage) formData.append("img_file_icon", iconImage);
    if (bannerImage) formData.append("img_file_banner", bannerImage);

    try {
      await createAnime(formData);
      setTitle("");
      setGenre("");
      setReleaseYear(undefined);
      setDescription("");
      setIconImage("");
      setBannerImage("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create anime:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Add New Anime"
          subtitle="Create a new anime series"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-slate-950/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="bg-blue-500/20 p-2 rounded-xl">
                <PlusCircleIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
                <DialogTitle className="text-2xl font-bold text-white">
                Add New Anime
                </DialogTitle>
                <p className="text-sm text-slate-400 mt-1">
                Fill in the details below to add a new anime.
                </p>
            </div>
          </DialogHeader>

          {/* Basic info card */}
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4 grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-300">
                  Title <span className="text-blue-400">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="My Hero Academia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
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
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
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
                  value={releaseYear || ""}
                  onChange={(e) => setReleaseYear(Number(e.target.value))}
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
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
                  className="w-full bg-black/40 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images card */}
          <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2">
                <label htmlFor="img_file_icon" className="text-sm font-medium text-slate-300">
                  Icon Image <span className="text-blue-400">*</span>{" "}
                  <span className="text-xs text-slate-500">(Square)</span>
                </label>
                <Input
                  id="img_file_icon"
                  name="img_file_icon"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setIconImage(e.target.files ? e.target.files[0] : "")}
                  className="cursor-pointer bg-black/40 border-white/10 text-slate-300 rounded-xl file:mr-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-blue-400 file:px-4 file:py-1.5 file:text-xs file:font-semibold hover:file:bg-blue-500/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="img_file_banner" className="text-sm font-medium text-slate-300">
                  Banner Image <span className="text-blue-400">*</span>{" "}
                  <span className="text-xs text-slate-500">(Wide)</span>
                </label>
                <Input
                  id="img_file_banner"
                  name="img_file_banner"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setBannerImage(e.target.files ? e.target.files[0] : "")}
                  className="cursor-pointer bg-black/40 border-white/10 text-slate-300 rounded-xl file:mr-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-blue-400 file:px-4 file:py-1.5 file:text-xs file:font-semibold hover:file:bg-blue-500/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50"
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
              {isLoading ? "Saving..." : "Save Anime"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddAnime;