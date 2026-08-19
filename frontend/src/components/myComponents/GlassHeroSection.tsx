import { Flame, Search, Swords, Heart, Gamepad2, Ghost, Star, Moon, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { IHeroAnime } from '../../interfaces/heroAnime.types';

interface Props {
  heroAnimes?: IHeroAnime[];
}

const GlassHeroSection = ({ heroAnimes = [] }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#09090b] via-[#18181b] to-[#27272a] p-8 text-white relative shadow-2xl mb-12 border border-white/5">
      {/* Decorative blurred blobs for background texture */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8ba4b8] rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-[#d9e5ec] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      {/* Top Navigation inside the Glass Section */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight">Flix.id</h1>

        <div className="flex items-center bg-black/80 rounded-full px-2 py-1">
          <button className="px-5 py-2 text-sm font-medium bg-black rounded-full shadow-md text-white">Movie</button>
          <button className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">Series</button>
          <button className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">Originals</button>
          <button className="p-2 ml-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>


      </div>

      {/* Hero Cards */}
      <div className="flex gap-6 mb-10 relative z-10">
        {/* Card 1 */}
        <div className="flex-1 h-[280px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10 mix-blend-multiply transition-opacity group-hover:opacity-80"></div>
          <img 
            src={heroAnimes[0]?.background_image || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop"} 
            alt={heroAnimes[0]?.title || "Blue Sword"} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
            <h2 className="text-4xl font-bold text-white max-w-[60%] leading-tight drop-shadow-md">
              {heroAnimes[0]?.title || "The Adventure of Blue Sword"}
            </h2>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20">
                <Play className="w-4 h-4 text-white fill-white" />
              </button>
              <span className="text-sm font-medium text-white/90 drop-shadow">Let Play Movie</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex-1 h-[280px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10 mix-blend-multiply transition-opacity group-hover:opacity-80"></div>
          <img 
            src={heroAnimes[1]?.background_image || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop"} 
            alt={heroAnimes[1]?.title || "Dol's Story"} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
            <h2 className="text-4xl font-bold text-white max-w-[70%] leading-tight drop-shadow-md">
              {heroAnimes[1]?.title || "Recalling the journey of Dol's exciting story"}
            </h2>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20">
                <Play className="w-4 h-4 text-white fill-white" />
              </button>
              <span className="text-sm font-medium text-white/90 drop-shadow">Let Play Movie</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex items-center justify-between gap-4 relative z-10 overflow-x-auto hide-scrollbar pb-2">
        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/20 transition-all whitespace-nowrap text-white/90">
          <Flame className="w-4 h-4" /> Trending
        </button>
        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/20 transition-all whitespace-nowrap text-white/90">
          <Swords className="w-4 h-4" /> Action
        </button>
        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/20 transition-all whitespace-nowrap text-white/90">
          <Heart className="w-4 h-4" /> Romance
        </button>
        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)] font-medium transition-all whitespace-nowrap">
          <Gamepad2 className="w-4 h-4" /> Animation
        </button>
        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/20 transition-all whitespace-nowrap text-white/90">
          <Ghost className="w-4 h-4" /> Horror
        </button>
        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/20 transition-all whitespace-nowrap text-white/90">
          <Star className="w-4 h-4" /> Special
        </button>
        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/20 transition-all whitespace-nowrap text-white/90">
          <Moon className="w-4 h-4" /> Drakor
        </button>
      </div>


    </div>
  );
};

export default GlassHeroSection;
