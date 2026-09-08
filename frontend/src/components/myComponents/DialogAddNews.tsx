import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";
import { useAnimeNewsStore } from "@/store/animeNewsStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Anime } from "@/interfaces/anime.types";
import { ScrollArea } from "../ui/scroll-area";
import { NewspaperIcon } from "lucide-react";

const DialogAddNews = ({ animes = [] }: { animes: Anime[] }) => {
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
      formData.append("related_postgres_anime_id", relatedPostgresAnimeId.toString());
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

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-slate-950/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <ScrollArea className="max-h-[85vh] pr-4">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <div className="bg-blue-500/20 p-2 rounded-xl">
                  <NewspaperIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                  Add News Article
                  </DialogTitle>
                  <p className="text-sm text-slate-400 mt-1">
                  Share the latest updates and announcements.
                  </p>
              </div>
            </DialogHeader>

            {/* Primary Info Card */}
            <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
              <CardContent className="p-4 grid gap-5 sm:grid-cols-2">
                {/* Title */}
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="title" className="text-sm font-medium text-slate-300">
                    Title <span className="text-blue-400">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Attack on Titan Season 4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
                  />
                </div>

                {/* Sub Title */}
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="sub_title" className="text-sm font-medium text-slate-300">
                    Sub Title
                  </label>
                  <Input
                    id="sub_title"
                    name="sub_title"
                    placeholder="Part 3 Release Date"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
                  />
                </div>

                {/* Body Text */}
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="body_text" className="text-sm font-medium text-slate-300">
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
                    className="w-full h-32 bg-black/40 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Metadata Card */}
            <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
              <CardContent className="p-4 grid gap-5 sm:grid-cols-2">
                {/* Tags */}
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="tags" className="text-sm font-medium text-slate-300">
                    Tags{" "}
                    <span className="text-xs text-slate-500">
                      (Comma separated)
                    </span>
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="Action, Drama, Titans"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label htmlFor="rating" className="text-sm font-medium text-slate-300">
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
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
                  />
                </div>

                {/* Views Text */}
                <div className="space-y-2">
                  <label htmlFor="views_text" className="text-sm font-medium text-slate-300">
                    Views Display Text
                  </label>
                  <Input
                    id="views_text"
                    name="views_text"
                    placeholder="2.5M Reads"
                    value={viewsText}
                    onChange={(e) => setViewsText(e.target.value)}
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
                  />
                </div>
                
                {/* Related ID */}
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="related_postgres_anime_id" className="text-sm font-medium text-slate-300">
                    Related Anime
                  </label>
                  <Select
                    value={relatedPostgresAnimeId ? String(relatedPostgresAnimeId) : ""}
                    onValueChange={(value) => setRelatedPostgresAnimeId((value))}
                  >
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
                    Selecting an anime sets the <code>related_postgres_anime_id</code>.
                  </p>
                  
                  {/* Keep the input to allow manual entry if needed or just show the ID */}
                  <Input
                    id="related_postgres_anime_id_input"
                    name="related_postgres_anime_id_input"
                    type="number"
                    placeholder="Or enter ID manually (e.g. 50)"
                    value={relatedPostgresAnimeId}
                    onChange={(e) => setRelatedPostgresAnimeId((e.target.value))}
                    className="mt-2 bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:border-blue-500/50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media Card */}
            <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <label htmlFor="background_image" className="text-sm font-medium text-slate-300">
                    Background Image <span className="text-blue-400">*</span>
                  </label>
                  <Input
                    id="background_image"
                    name="background_image"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setBackgroundImage(e.target.files ? e.target.files[0] : "")}
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
