import { Link } from "react-router-dom";
import { TwitterIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import Tetris from "./Tetris";

const AnimeFooter = () => {

  return (
    <footer className="w-full relative py-12 px-4 md:px-8 bg-[#010409] overflow-hidden">
      
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
      </div>

      {/* ── Inner Container ── */}
      <div className="relative max-w-7xl mx-auto flex flex-col min-h-[500px]">
        
        {/* Top Content Area */}
        <div className="flex flex-col lg:flex-row justify-between p-12 lg:p-16 z-10">
          
          {/* Left Side: Brand & Social */}
          <div className="space-y-6 max-w-sm mb-12 lg:mb-0">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-black text-[#fdfdfd] tracking-wide" style={{ fontFamily: "Righteous, cursive" }}>
                Ani<span className="text-blue-500">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 font-medium">
              Your ultimate destination for discovering, tracking, and discussing the best anime.
            </p>
            
            <div className="flex gap-4 pt-4">
              <a href="#" className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <TwitterIcon className="size-4" />
              </a>
              <a href="#" className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <InstagramIcon className="size-4" />
              </a>
              <a href="#" className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <LinkedinIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Right Side: Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            
            {/* Column 1 */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-[#fdfdfd] font-serif text-lg mb-2">Explore</h3>
              <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">HomeIcon</Link>
              <Link to="/browse" className="text-sm text-gray-400 hover:text-white transition-colors">Browse</Link>
              <Link to="/favorites" className="text-sm text-gray-400 hover:text-white transition-colors">Favorites</Link>
              <Link to="/watchlist" className="text-sm text-gray-400 hover:text-white transition-colors">Watchlist</Link>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-[#fdfdfd] font-serif text-lg mb-2">Community</h3>
              <Link to="/chat" className="text-sm text-gray-400 hover:text-white transition-colors">Live Chat</Link>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Discord Server</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Top Reviews</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">News & Updates</a>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-[#fdfdfd] font-serif text-lg mb-2">Legal</h3>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>

          </div>
        </div>

        {/* Bottom Graphic: Tetris Canvas */}
        <div className="absolute bottom-0 left-0 right-0 h-48 w-full overflow-hidden pointer-events-none opacity-90">
          <div 
            className="absolute bottom-0 w-full flex justify-center h-full"
            style={{ paddingBottom: '0px' }}
          >
            <div className="relative w-full h-full max-w-[1200px]">
              <Tetris 
                boardColor="rgba(255, 255, 255, 0)" 
                colors={["#3b82f6", "#8b5cf6", "#4f46e5", "#06b6d4"]}
                cellSize={18}
                gap={4}
                rounded={20}
                dropSpeed={2}
              />
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default AnimeFooter;
