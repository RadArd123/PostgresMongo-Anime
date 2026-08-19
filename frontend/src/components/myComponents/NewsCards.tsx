import { useEffect, useRef, useState } from "react";
import { Star, TrendingUp } from "lucide-react";
import { useAnimeNewsStore } from "@/store/animeNewsStore";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const NewsCards = () => {
  const [isSliding, setIsSliding] = useState(false);
  const startX = useRef(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastPageX = useRef(0);
  const animationRef = useRef(0);

  const { animeNews ,getAnimeNews} = useAnimeNewsStore();

  useEffect(() => {
    getAnimeNews();
  }, [getAnimeNews]);

  const momentumScroll = () => {
    if (!sliderRef.current) return;

    // Apply friction to slow the velocity down (e.g., 0.95)
    velocity.current *= 0.95;

    // Stop the animation if velocity is negligible
    if (Math.abs(velocity.current) < 0.5) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    // Apply the current velocity to the scroll position
    sliderRef.current.scrollLeft -= velocity.current;

    // Request the next frame
    animationRef.current = requestAnimationFrame(momentumScroll);
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    cancelAnimationFrame(animationRef.current);
    setIsSliding(true);

    startX.current = e.pageX;
    scrollLeft.current = sliderRef.current.scrollLeft;
    lastPageX.current = e.pageX;
  };
  const handleMouseUp = () => {
    setIsSliding(false);

    // 3. Start the momentum scroll if there is speed
    if (Math.abs(velocity.current) > 2) {
      animationRef.current = requestAnimationFrame(momentumScroll);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSliding || !sliderRef.current) return;

    const deltaX = e.pageX - lastPageX.current;
    velocity.current = velocity.current * 0.8 + deltaX * 0.2;

    const dragDistance = e.pageX - startX.current;
    sliderRef.current.scrollLeft = scrollLeft.current - dragDistance;

    lastPageX.current = e.pageX;
  };

  return (
    <div className="max-w-8xl mx-auto">
      {/* Header */}
      <div className="border-l-4 border-blue-600 pl-4 mb-8 px-4">
        <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight">
          Latest Anime News
        </h1>
        <p className="text-gray-400 mt-2">Discover the latest stories in anime</p>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-scroll hide-scrollbar cursor-grab select-none active:cursor-grabbing gap-6 px-4 pb-8"
      >
        {animeNews.map((news) => (
          <Dialog key={news.id}>
            <DialogTrigger asChild onClick={(e) => {
              // Prevent opening if user is actively dragging the slider
              if (Math.abs(startX.current - e.pageX) > 5) {
                e.preventDefault();
              }
            }}>
              <div
                className="shrink-0 h-[380px] md:h-[450px] group relative w-[85vw] sm:w-[320px] md:w-[400px] lg:w-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gray-900 cursor-pointer"
              >
                {/* Image Container */}
                <img
                  src={news.background_image}
                  alt={news.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent opacity-50 pointer-events-none" />

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-8 pointer-events-none">
                  {/* Top Section: Category Badge */}
                  <div className="flex items-start">
                    <span className="backdrop-blur-md bg-blue-600/80 text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
                      {news.tags?.[0] || "News"}
                    </span>
                  </div>

                  {/* Bottom Section: Text and Stats */}
                  <div className="mt-auto space-y-3">
                    <div className="space-y-1.5">
                      <p className="text-[10px] sm:text-xs md:text-sm text-blue-400 font-semibold uppercase tracking-widest drop-shadow-md">
                        {new Date(news.publish_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight line-clamp-2 drop-shadow-lg group-hover:text-blue-100 transition-colors">
                        {news.title}
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-gray-300 line-clamp-2 font-medium drop-shadow-md">
                        {news.body_text}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-300 pt-3 border-t border-white/20">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400 drop-shadow-md" />
                        <span className="font-bold text-white drop-shadow-md">{news?.overlay_stats?.rating || "-"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 drop-shadow-md" />
                        <span className="font-bold text-white drop-shadow-md">{news?.overlay_stats?.views_text || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow / Border */}
                <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-blue-500/50 transition-colors duration-500 pointer-events-none" />
              </div>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-4xl max-h-[95vh] p-0 bg-black/95 backdrop-blur-2xl text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="relative w-full h-[250px] md:h-[400px] shrink-0">
                <img
                  src={news.background_image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 pr-6">
                  <span className="backdrop-blur-md bg-blue-600/80 text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
                    {news.tags?.[0] || "News"}
                  </span>
                  <DialogTitle asChild>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg mt-4 max-w-3xl">
                      {news.title}
                    </h2>
                  </DialogTitle>
                  <p className="text-xs md:text-sm text-blue-400 font-semibold uppercase tracking-widest mt-3">
                    {new Date(news.publish_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <ScrollArea className="flex-1 px-6 py-6 md:px-10 overflow-y-auto">
                <div className="flex items-center gap-6 text-sm text-gray-300 pb-6 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-white">{news?.overlay_stats?.rating || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white">{news?.overlay_stats?.views_text || "-"}</span>
                  </div>
                </div>
                <div className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium pb-8">
                  {news.body_text}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Scroll Indicator */}
      <p className="text-gray-500 text-sm px-4 flex items-center gap-2">
        <span>←</span> Drag to scroll through news <span>→</span>
      </p>
    </div>
  );
};

export default NewsCards;
