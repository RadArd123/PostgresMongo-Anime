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
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="h-full">
        <CarouselContent className="h-full ">
          {heroAnimes.map((slide, index) => (
            <CarouselItem key={slide.id} className="h-screen w-full p-0">
              <div
                className="relative h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.background_image})` }}
              >
                {/* dark veil */}
                <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/50 to-black/30" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-black to-transparent"/>

                {/* left-aligned card */}
                <div className="absolute inset-0 flex items-center pl-[120px] md:pl-[140px] pr-6 md:pr-12">
                  <div className="max-w-2xl rounded-2xl border-none border-transparent bg-transparent text-white">
                    <div className="p-6 md:p-8">
                      <SplitTextAnime
                        englishText={slide.title}
                        japaneseText={slide.original_title}
                        className="mb-4 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl"
                        isActive={current === index}
                      />
                      <BlurText
                        key={slide.id}
                        text={slide.description || ""}
                        className="mb-6 max-w-prose text-white/90 md:text-lg"
                        delay={15}
                        animateBy="words"
                        direction="bottom"
                        animationFrom={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
                        animationTo={[{ opacity: 1, filter: 'blur(0px)', y: 0 }]}
                        onAnimationComplete={() => {}}
                      />

                      {/* badges row */}
                      <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/15 px-4 py-2 text-sm font-semibold text-yellow-300">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-yellow-500/30">
                              <StarIcon className="h-4 w-4" />
                            </span>
                            {slide.rating}
                          </div>
                          <Button variant="default"  className="h-10 w-40 shrink-0 rounded-full bg-blue-700 hover:bg-blue-800 text-neutral-200 shadow-2xl">
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
        <CarouselPrevious className="left-[120px] top-1/2 -translate-y-1/2 border-white/30 bg-black/40 text-white hover:bg-black/60" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 border-white/30 bg-black/40 text-white hover:bg-black/60" />
      </Carousel>
    </div>
  );
};

export default BannerImg;
