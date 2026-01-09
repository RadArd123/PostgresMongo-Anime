import AnimeFavWatch from "@/components/myComponents/AnimeFavWatch";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useEffect } from "react";
import { Star, LayoutGrid} from "lucide-react"; // Assuming you use lucide-react

const FavoritesPage = () => {
  const { currentUserFavorites, fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-100 ">
      
      {/* ---- MAIN WRAPPER ---- */}
      <div className="flex-1 flex flex-col lg:ml-64">
        

        <main className="flex-1">
          <div className="w-full mx-auto px-6 py-14 space-y-10">
            
            {/* ---- HEADER SECTION ---- */}
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm tracking-widest uppercase">
                <Star size={16} fill="currentColor" />
                <span>Personal Collection</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-linear-to-r from-white to-slate-500 bg-clip-text text-transparent">
                Favorite
              </h1>
            </header>

            {/* ---- MAIN CONTENT GRID ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT: ANIME LIST (8 Columns) */}
              <section className="lg:col-span-10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <LayoutGrid size={20} className="text-slate-400" />
                    <h2 className="text-xl font-bold">Adaugate Recent</h2>
                  </div>
                  <span className="text-xs text-slate-500 font-mono bg-white/5 px-2 py-1 rounded">
                    {currentUserFavorites.length} TITLURI
                  </span>
                </div>

                {currentUserFavorites.length > 0 ? (
                  <div className="group transition-all duration-500">
                    <AnimeFavWatch animes={currentUserFavorites} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white/2 border border-white/5 rounded-3xl">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Star className="text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-medium">Your library is empty</p>
                    <button className="mt-4 text-sm bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-indigo-500 hover:text-white transition-colors">
                        Browse Anime
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FavoritesPage;