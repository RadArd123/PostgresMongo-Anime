import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {Dialog, DialogContent,  DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";

import {useAnimeStore} from "@/store/animeStore";



const DialogAddAnime = () => {

  const {createAnime, isLoading} = useAnimeStore();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [iconImage, setIconImage] = useState<File | "">("");
  const [bannerImage, setBannerImage] = useState<File | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    if(releaseYear) formData.append("release_year", releaseYear.toString());
    formData.append("description", description);
    if(iconImage) formData.append("img_file_icon", iconImage);
    if(bannerImage) formData.append("img_file_banner", bannerImage);
  
    try{
      await createAnime(formData);
      setTitle("");
      setGenre("");
      setReleaseYear(undefined);
      setDescription("");
      setIconImage("");
      setBannerImage("");
    } catch (error) {
      console.error("Failed to create anime:", error);
    }
    };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionCard
          title="Add New Anime"
          subtitle="Create a new anime series"
        />
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-3xl max-h-screen overflow-y-auto bg-linear-to-b from-black via-slate-950 to-black text-white rounded-2xl shadow-2xl border border-blue-500/30 p-4 sm:p-6"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <DialogHeader className="">
            <DialogTitle className="text-2xl font-bold text-white">
              Add New Anime
            </DialogTitle>
            <p className="text-sm text-slate-400">
              Fill in the details below to add a new anime.
            </p>
          </DialogHeader>

          {/* Basic info card */}
          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl backdrop-blur">
            <CardContent className="p-3 pb-0 grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                <label
                  htmlFor="Title"
                  className="text-sm font-medium text-slate-100"
                >
                  Title <span className="text-blue-400">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="My Hero Academia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="genre"
                  className="text-sm font-medium text-slate-100"
                >
                  Genre
                </label>
                <Input
                  id="genre"
                  name="genre"
                  placeholder="Action, Fantasy"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="release_year"
                  className="text-sm font-medium text-slate-100"
                >
                  Release Year
                </label>
                <Input
                  id="release_year"
                  name="release_year"
                  type="number"
                  placeholder="2013"
                  value={releaseYear || ""}
                  onChange={(e) => setReleaseYear(Number(e.target.value))}
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-100"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Short synopsis or your thoughts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images card */}
          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl backdrop-blur">
            <CardContent className="p-3 sm:p-4 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="img_file_icon"
                  className="text-sm font-medium text-slate-100"
                >
                  Icon Image <span className="text-blue-400">*</span>{" "}
                  <span className="text-xs text-slate-400">(Square)</span>
                </label>
                <Input
                  id="img_file_icon"
                  name="img_file_icon"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setIconImage(e.target.files ? e.target.files[0] : "")}
                  className="cursor-pointer bg-slate-900/70 border border-slate-700/60 text-white rounded-xl file:mr-3 file:rounded-lg file:border-0 file:bg-blue-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-950 hover:file:bg-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="img_file_banner"
                  className="text-sm font-medium text-slate-100"
                >
                  Banner Image <span className="text-blue-400">*</span>{" "}
                  <span className="text-xs text-slate-400">(Wide)</span>
                </label>
                <Input
                  id="img_file_banner"
                  name="img_file_banner"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setBannerImage(e.target.files ? e.target.files[0] : "")}
                  className="cursor-pointer bg-slate-900/70 border border-slate-700/60 text-white rounded-xl file:mr-3 file:rounded-lg file:border-0 file:bg-blue-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-950 hover:file:bg-blue-600"
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
            >{isLoading ? "Saving..." : "Save Anime"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddAnime;