import { useEffect, useState } from "react";
import SplitTextAnime from "./SplitTextAnime";
import BlurText from "./BlurText";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useHeroAnimeStore } from "@/store/heroAnime.Store";

const BannerImg = () => {
  const { heroAnimes, getHeroAnimes } = useHeroAnimeStore();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getHeroAnimes();
  }, [getHeroAnimes]);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <div className="relative w-full min-w-0 overflow-hidden" data-testid="home-hero">
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} aria-label="Featured anime">
        <CarouselContent className="ml-0 items-stretch">
          {heroAnimes.map((slide, index) => (
            <CarouselItem key={slide.id} className="w-full p-0 md:h-screen">
              <div
                className="relative h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.background_image})` }}
              >
                {/* dark veil */}
                <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/50 to-black/30" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-black to-transparent"/>

                {/* left-aligned card */}
                <div className="relative flex min-h-[min(44rem,90svh)] h-full items-end px-5 pt-24 pb-24 sm:px-8 md:absolute md:inset-0 md:min-h-0 md:items-center md:pl-[140px] md:pr-12 md:py-0">
                  <div className="w-full min-w-0 max-w-2xl rounded-2xl border-none border-transparent bg-transparent text-white">
                    <div className="md:p-8">
                      <SplitTextAnime
                        englishText={slide.title}
                        japaneseText={slide.original_title}
                        className="hero-title mb-4 text-[clamp(1.5rem,7vw,2rem)] font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl"
                        isActive={current === index}
                      />
                      <BlurText
                        key={slide.id}
                        text={slide.description || ""}
                        className="mb-6 max-w-prose text-base leading-relaxed text-white/90 md:text-lg"
                        delay={15}
                        animateBy="words"
                        direction="bottom"
                        animationFrom={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
                        animationTo={[{ opacity: 1, filter: 'blur(0px)', y: 0 }]}
                        onAnimationComplete={() => {}}
                      />

                      {/* badges row */}
                      <div className="flex flex-wrap items-center gap-3 relative z-10">
                          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/15 px-4 py-2 text-sm font-semibold text-yellow-300">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-yellow-500/30">
                              <StarIcon className="h-4 w-4" />
                            </span>
                            {slide.rating}
                          </div>
                          <Button variant="default"  className="h-11 w-40 max-w-full shrink-0 rounded-full bg-blue-700 hover:bg-blue-800 text-neutral-200 shadow-2xl md:h-10">
                            <p className="font-extrabold">Start Watching</p>
                          </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-5 top-auto bottom-5 size-11 translate-y-0 border-white/30 bg-black/40 text-white hover:bg-black/60 md:left-[120px] md:top-1/2 md:bottom-auto md:size-8 md:-translate-y-1/2" />
        <CarouselNext className="right-5 top-auto bottom-5 size-11 translate-y-0 border-white/30 bg-black/40 text-white hover:bg-black/60 md:right-4 md:top-1/2 md:bottom-auto md:size-8 md:-translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default BannerImg;
