import { ScrollArea } from "@/components/ui/scroll-area";
import type { IAnimeNews } from "@/interfaces/animeNews.types";



const NewsAdmin = ({news}: {news: IAnimeNews[]}) => {
    return (
  <div className=" p-3 rounded-lg w-full ">
    <ScrollArea className="h-[80vh] pr-2">
      {news.map((news) => (
        <div key={news._id} className="flex gap-3 mb-4">
          <img
            className="w-24 h-16 rounded-lg object-cover"
            alt={news.title}
            src={news.background_image}
          />

          <div className="flex flex-col overflow-hidden">
            <h3 className="font-bold text-lg line-clamp-1">
              {news.title}
            </h3>

            <p className="text-sm text-gray-400 line-clamp-1">
                {news.tags?.join(", ")} • 
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  </div>
);
}

export default NewsAdmin
