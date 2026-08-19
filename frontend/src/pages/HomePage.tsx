import AnimeCards from "@/components/myComponents/AnimeCards";
import AnimeSuggestion from "@/components/myComponents/AnimeSuggestion";
import BannerImg from "@/components/myComponents/BannerImg";
import Footer from "@/components/myComponents/Footer";


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

  const topAnimetitle:string = "Top Animes";
  const popularAnimeTitle:string = "Most Popular";

  return (
    <div className="w-full h-full ">
      <BannerImg />

      {/* Responsive container taking full available width while clearing sidebar */}
      <div className="relative w-full pl-[130px] md:pl-[150px] pr-8 md:pr-16 space-y-20 pt-8 pb-12 z-10">
        
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


        <section >
          <Footer />
        </section>
      </div>
      
    </div>
    
  );
};

export default HomePage;
