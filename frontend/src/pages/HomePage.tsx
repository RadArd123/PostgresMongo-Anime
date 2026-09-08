import AnimeCards from "@/components/myComponents/AnimeCards";
import AnimeSuggestion from "@/components/myComponents/AnimeSuggestion";
import BannerImg from "@/components/myComponents/BannerImg";
import NewEpisodesSection from "@/components/myComponents/NewEpisodesSection";
import NewsCards from "@/components/myComponents/NewsCards";
import { useAnimeStore } from "@/store/animeStore";
import { useEffect, useMemo } from "react";



const HomePage = () => {
  const {animes, fetchAnimes} = useAnimeStore();
   const topAnimes = useMemo(() => [...animes].sort(() => Math.random() - 0.5).slice(0, 10), [animes]); 
   const popularAnimes = useMemo(() => [...animes].sort(() => Math.random() - 0.3).slice(0, 10), [animes]); 


  useEffect(() => {
    fetchAnimes();
  }, []);

  const topAnimetitle:string = "Cele Mai Bune Anime";
  const popularAnimeTitle:string = "Cele Mai Populare";

  return (
    <div className="w-full h-full ">
      <BannerImg />

      {/* Responsive container taking full available width while clearing sidebar on desktop */}
      <div className="relative w-full px-4 md:pl-[130px] lg:pl-[150px] md:pr-16 space-y-20 pt-8 pb-12 z-10">
        
        {/* New Glassmorphism Preview Section */}
        {/* Top Animes Section restored to its original place */}
        <section>
          <AnimeCards title={topAnimetitle} animes={topAnimes} />
        </section>

        <section>
          <NewsCards />
        </section>

        <section>
          <AnimeCards title={popularAnimeTitle} animes={popularAnimes} />
        </section>

        <section>
          <AnimeSuggestion />
        </section>

        <section>
          <NewEpisodesSection />
        </section>

      </div>
      
    </div>
    
  );
};

export default HomePage;
