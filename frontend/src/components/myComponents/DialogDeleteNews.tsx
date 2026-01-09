import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {Dialog, DialogContent,  DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import ActionCard from "./ActionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { IAnimeNews } from "@/interfaces/animeNews.types";
import { useAnimeNewsStore } from "@/store/animeNewsStore";



const DialogDeleteNews = ({news}: {news: IAnimeNews[]}) => {

 const {removeAnimeNews, isLoading} = useAnimeNewsStore();
  const [newsId, setNewsId ] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try{
      await removeAnimeNews(newsId);
        setNewsId("");
 
    } catch (error) {
      console.error("Failed to create anime:", error);
    }
    };

    return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionCard
          title="Delete News"
          subtitle="Delete an existing news article"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-linear-to-b from-black via-slate-950 to-black text-white rounded-2xl shadow-2xl border border-blue-500/30 p-4 sm:p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Delete News
            </DialogTitle>
            <p className="text-sm text-slate-400">
              Fill the news ID below to delete a news article.
            </p>
          </DialogHeader>

          {/* Episode info card */}
          <Card className="bg-slate-900/60 border border-blue-500/20 rounded-2xl backdrop-blur">
            <CardContent className="p-3 pb-0 grid gap-4 sm:grid-cols-2">
              {/* Anime select (sets anime_id) */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="anime_id"
                  className="text-sm font-medium text-slate-100"
                >
                  News <span className="text-blue-400">*</span>
                </label>
                <Select
                  value={newsId}
                  onValueChange={(value) => setNewsId(value)}
                >
                  <SelectTrigger className="bg-slate-900/70 border border-slate-700/60 text-white rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500">
                    <SelectValue placeholder="Select news" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border border-slate-700/60 text-white">
                    {news?.map((newsItem) => (
                      <SelectItem key={newsItem._id} value={String(newsItem._id)}>
                        {newsItem.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400">
                  The selected news’s ID will be used as <code>news_id</code>.
                </p>
              </div>

              {/* news_id input (read-only, auto-filled) */}
              <div className="space-y-2">
                <label
                  htmlFor="news_id"
                  className="text-sm font-medium text-slate-100"
                >
                  News ID
                </label>
                <Input
                  id="news_id"
                  name="news_id"
                  value={newsId}
                  readOnly
                  placeholder="Select a news above"
                  className="bg-slate-900/70 border border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
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
            >{isLoading ? "Deleting..." : "Delete Anime"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteNews;