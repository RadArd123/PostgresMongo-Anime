import { useEffect, useRef, useState } from "react";
import { Star, TrendingUp } from "lucide-react";
import { useAnimeNewsStore } from "@/store/animeNewsStore";


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
    <div className="max-w-8xl mx-auto ">
      {/* Header */}
      <div className="border-l-4 border-blue-700 pl-4 mb-8 px-4">
        <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight">
          Latest Anime News
        </h1>
        <p className="text-gray-400 mt-2">Discover the latest stories in anime</p>
      </div>

      {/* Full Width Slider */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-scroll hide-scrollbar cursor-grab select-none active:cursor-grabbing"
      >
        {animeNews.map((news) => (
          <div
            key={news._id}
            className="shrink-0 h-120 group relative flex items-center justify-center w-full min-w-full"

          >
            {/* Image Container with Rounded Corners */}
            <div className="absolute inset-0 mx-4 rounded-2xl overflow-hidden pointer-events-none">
              <img
                src={news.background_image}
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 mx-4 rounded-2xl flex flex-col justify-between p-6 md:p-8 text-white pointer-events-none">
              {/* Top Section: Category Badge */}
              <div className="flex justify-between items-start">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                  {news.tags?.[0] || "News"}
                </span>
              </div>

              {/* Bottom Section: Title, Description, Stats */}
              <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div>
                  <p className="text-xs text-gray-300 mb-1 uppercase tracking-wide">{new Date(news.publish_date).toLocaleDateString()}</p>
                  <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {news.title}
                  </h2>
                  <p className="text-gray-200 text-sm md:text-base line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {news.body_text}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2 border-t border-gray-500/50">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                   <span>{news?.overlay_stats?.rating ? news.overlay_stats.rating : " "}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>{news?.overlay_stats?.views_text ? news.overlay_stats.views_text : " "} </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Border */}
            <div className="absolute inset-0 mx-4 rounded-2xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <p className="text-gray-500 text-sm mt-4 px-4">← Drag to scroll through news →</p>
    </div>
  );
};

export default NewsCards;
