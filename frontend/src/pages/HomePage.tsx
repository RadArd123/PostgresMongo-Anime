import AnimeCards from "@/components/myComponents/AnimeCards";
import AnimeSuggestion from "@/components/myComponents/AnimeSuggestion";
import BannerImg from "@/components/myComponents/BannerImg";
import Footer from "@/components/myComponents/Footer";


import NewEpisodesSection from "@/components/myComponents/NewEpisodesSection";
import NewsCards from "@/components/myComponents/NewsCards";
import { useAnimeStore } from "@/store/animeStore";
import { useEffect } from "react";

const HomePage = () => {
  const {animes, fetchAnimes} = useAnimeStore();
   const topAnimes = animes.sort(() => Math.random() - 0.5).slice(0, 10); 
   const popularAnimes = animes.sort(() => Math.random() - 0.3).slice(0, 10); 


  useEffect(() => {
    fetchAnimes();
  }, []);

  const topAnimetitle:string = "Top Animes";
  const popularAnimeTitle:string = "Most Popular";

  return (
    <div className="w-full h-full ">
      <BannerImg />

      {/* Centered responsive container so sections stack and don't overlap */}
      <div className="absolute max-w-[85vw] mx-auto px-4 space-y-20 left-[10vw]">
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
