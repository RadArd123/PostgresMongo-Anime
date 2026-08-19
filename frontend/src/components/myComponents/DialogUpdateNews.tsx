import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";
import { useAnimeNewsStore } from "@/store/animeNewsStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Anime } from "@/interfaces/anime.types";
import type { IAnimeNews } from "@/interfaces/animeNews.types";
import { ScrollArea } from "../ui/scroll-area";
import { Edit } from "lucide-react";

const DialogUpdateNews = ({ animes = [], news = [] }: { animes: Anime[], news: IAnimeNews[] }) => {
  const { updateAnimeNews, isLoading } = useAnimeNewsStore();
  const [open, setOpen] = useState(false);

  const [selectedNewsId, setSelectedNewsId] = useState("");

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [tags, setTags] = useState("");
  const [relatedPostgresAnimeId, setRelatedPostgresAnimeId] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [viewsText, setViewsText] = useState("");

  useEffect(() => {
    if (selectedNewsId) {
        const item = news.find(n => String(n.id) === selectedNewsId);
        if (item) {
            setTitle(item.title || "");
            setSubTitle(item.sub_title || "");
            setBodyText(item.body_text || "");
            setTags(item.tags ? item.tags.join(", ") : "");
            setRelatedPostgresAnimeId(item.related_postgres_anime_id ? String(item.related_postgres_anime_id) : "");
            setRating(item.overlay_stats?.rating ?? "");
            setViewsText(item.overlay_stats?.views_text || "");
        }
    } else {
        setTitle("");
        setSubTitle("");
        setBodyText("");
        setTags("");
        setRelatedPostgresAnimeId("");
        setRating("");
        setViewsText("");
    }
  }, [selectedNewsId, news]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewsId) return;

    try {
      await updateAnimeNews(Number(selectedNewsId), {
          title,
          sub_title: subTitle,
          body_text: bodyText,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          related_postgres_anime_id: relatedPostgresAnimeId ? Number(relatedPostgresAnimeId) : undefined,
          overlay_stats: {
              rating: rating !== "" ? Number(rating) : undefined,
              views_text: viewsText
          }
      });
      setSelectedNewsId("");
      setOpen(false); 
    } catch (error) {
      console.error("Failed to update news:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ActionCard
          title="Update News"
          subtitle="Modify details of an existing news article"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-slate-950/80 backdrop-blur-2xl text-white rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <ScrollArea className="max-h-[85vh] pr-4">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <div className="bg-amber-500/20 p-2 rounded-xl">
                  <Edit className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                  Update News Article
                  </DialogTitle>
                  <p className="text-sm text-slate-400 mt-1">
                  Select a news article to modify.
                  </p>
              </div>
            </DialogHeader>

            {/* Selection Card */}
            <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
              <CardContent className="p-4">
                  <div className="space-y-2">
                      <label htmlFor="select_news" className="text-sm font-medium text-slate-300">
                      Select News <span className="text-amber-400">*</span>
                      </label>
                      <Select
                          value={selectedNewsId}
                          onValueChange={(value) => setSelectedNewsId(value)}
                      >
                      <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-0 focus-visible:border-amber-500 hover:border-amber-500/50">
                          <SelectValue placeholder="Choose a news article to update" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border border-slate-700 text-white max-h-60">
                          {news.map((n) => (
                          <SelectItem key={n.id} value={String(n.id)}>
                              {n.title}
                          </SelectItem>
                          ))}
                      </SelectContent>
                      </Select>
                  </div>
              </CardContent>
            </Card>

            {selectedNewsId && (
                <>
                {/* Primary Info Card */}
                <Card className="bg-white/5 border border-white/5 rounded-2xl shadow-inner">
                <CardContent className="p-4 grid gap-5 sm:grid-cols-2">
                    {/* Title */}
                    <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="title" className="text-sm font-medium text-slate-300">
                        Title <span className="text-amber-400">*</span>
                    </label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="Attack on Titan Season 4"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
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
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                    />
                    </div>

                    {/* Body Text */}
                    <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="body_text" className="text-sm font-medium text-slate-300">
                        Body Text <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                        id="body_text"
                        name="body_text"
                        rows={4}
                        placeholder="The final season begins..."
                        value={bodyText}
                        onChange={(e) => setBodyText(e.target.value)}
                        required
                        className="w-full h-32 bg-black/40 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50 resize-none"
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
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
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
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
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
                        className="bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
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
                        <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-0 focus-visible:border-amber-500 hover:border-amber-500/50">
                        <SelectValue placeholder="Select anime" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border border-slate-700 text-white">
                        <SelectItem value="none">None</SelectItem>
                        {animes.map((anime) => (
                            <SelectItem key={anime.id} value={String(anime.id)}>
                            {anime.title}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    
                    <Input
                        id="related_postgres_anime_id_input"
                        name="related_postgres_anime_id_input"
                        type="number"
                        placeholder="Or enter ID manually (e.g. 50)"
                        value={relatedPostgresAnimeId === "none" ? "" : relatedPostgresAnimeId}
                        onChange={(e) => setRelatedPostgresAnimeId((e.target.value))}
                        className="mt-2 bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 hover:border-amber-500/50"
                    />
                    </div>
                </CardContent>
                </Card>
                </>
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
                disabled={isLoading || !selectedNewsId}
                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update News"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpdateNews;
