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

// Importing the store you provided
import { useAnimeNewsStore } from "@/store/animeNewsStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Anime } from "@/interfaces/anime.types";
import { ScrollArea } from "../ui/scroll-area";

const DialogAddNews = ({animes= []}: {animes: Anime[]}) => {
  const { addAnimeNews, isLoading } = useAnimeNewsStore();
  const [open, setOpen] = useState(false);

  // State mapped strictly to the keys in your image
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [tags, setTags] = useState("");
  const [relatedPostgresAnimeId, setRelatedPostgresAnimeId] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [viewsText, setViewsText] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<File | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData to handle the file upload and text fields
    const formData = new FormData();
    formData.append("title", title);
    formData.append("sub_title", subTitle);
    formData.append("body_text", bodyText);
    formData.append("tags", tags);
    if (relatedPostgresAnimeId)
      formData.append(
        "related_postgres_anime_id",
        relatedPostgresAnimeId.toString()
      );
    if (rating) formData.append("rating", rating.toString());
    formData.append("views_text", viewsText);
    if (backgroundImage) formData.append("background_image", backgroundImage);

    try {
      // Cast to any because store expects object but we need to send FormData for file upload
      await addAnimeNews(formData as any);

      // Reset form
      setTitle("");
      setSubTitle("");
      setBodyText("");
      setTags("");
      setRelatedPostgresAnimeId("");
      setRating("");
      setViewsText("");
      setBackgroundImage("");
      setOpen(false); // Optional: close dialog on success
    } catch (error) {
      console.error("Failed to create news:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Add News"
          subtitle="Post updates, releases, or announcements"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-linear-to-b from-black via-slate-950 to-black text-white rounded-2xl shadow-2xl border border-blue-500/30 p-4 sm:p-6">
      <ScrollArea className="max-h-[90vh]">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Add News Article
            </DialogTitle>
          </DialogHeader>

          {/* Primary Info Card */}
          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl">
            <CardContent className="pb-0 grid gap-4 sm:grid-cols-2">
              {/* Title */}
              <div className="flex justify-between w-full gap-3 sm:col-span-2">
                <div className="space-y-2 col-span-2 w-full">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-100"
                  >
                    Title <span className="text-blue-400">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Attack on Titan Season 4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                </div>

                {/* Sub Title */}
                <div className="space-y-2 col-span-2 w-full">
                  <label
                    htmlFor="sub_title"
                    className="text-sm font-medium text-slate-100"
                  >
                    Sub Title
                  </label>
                  <Input
                    id="sub_title"
                    name="sub_title"
                    placeholder="Part 3 Release Date"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  />
                </div>
              </div>

              {/* Body Text */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="body_text"
                  className="text-sm font-medium text-slate-100"
                >
                  Body Text <span className="text-blue-400">*</span>
                </label>
                <textarea
                  id="body_text"
                  name="body_text"
                  rows={4}
                  placeholder="The final season begins..."
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  required
                  className="w-full h-20 bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl ">
            <CardContent className="p-3 pb-0 grid gap-4 sm:grid-cols-2">
              <div className ="flex flex-col sm:col-span-2 sm:flex-row sm:gap-4">
              {/* Tags */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="tags"
                  className="text-sm font-medium text-slate-100"
                >
                  Tags{" "}
                  <span className="text-xs text-slate-400">
                    (Comma separated)
                  </span>
                </label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="Action, Drama, Titans"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label
                  htmlFor="rating"
                  className="text-sm font-medium text-slate-100"
                >
                  Rating
                </label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  placeholder="9.2"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
              </div>

              {/* Views Text */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="views_text"
                  className="text-sm font-medium text-slate-100"
                >
                  Views Display Text
                </label>
                <Input
                  id="views_text"
                  name="views_text"
                  placeholder="2.5M Reads"
                  value={viewsText}
                  onChange={(e) => setViewsText(e.target.value)}
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
              </div>
              </div>
              {/* Related ID */}
              <div className="space-y-2">
                <label
                  htmlFor="related_postgres_anime_id"
                  className="text-sm font-medium text-slate-100"
                >
                  Related Anime ID
                </label>
                    <Select
                  value={relatedPostgresAnimeId? String(relatedPostgresAnimeId) : ""}
                  onValueChange={(value) => setRelatedPostgresAnimeId((value))}
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
                <Input
                  id="related_postgres_anime_id"
                  name="related_postgres_anime_id"
                  type="number"
                  placeholder="50"
                  value={relatedPostgresAnimeId}
                  onChange={(e) =>
                    setRelatedPostgresAnimeId((e.target.value))
                  }
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Card */}
          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl">
            <CardContent className="p-3 ">
              <div className="space-y-2">
                <label
                  htmlFor="background_image"
                  className="text-sm font-medium text-slate-100"
                >
                  Background Image <span className="text-blue-400">*</span>
                </label>
                <Input
                  id="background_image"
                  name="background_image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setBackgroundImage(e.target.files ? e.target.files[0] : "")
                  }
                  className="cursor-pointer bg-slate-900/70 border border-slate-700/60 text-white rounded-lg file:mr-3 file:rounded-lg file:border-0 file:bg-blue-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-950 hover:file:bg-blue-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
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
              {isLoading ? "Publishing..." : "Publish News"}
            </Button>
          </div>
        </form>
         </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddNews;
