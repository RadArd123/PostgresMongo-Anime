
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star} from "lucide-react";
import { Button } from "../ui/button";


const slideShow = [
  {
    img: "src/assets/Dandadan.jpg",
    id: 57334,
    alt: "Dandadan Anime Poster",
    title: "Dandadan",
    title_japanese: "ダンダダン",
    synopsis:
      "Momo Ayase este o liceană care crede în fantome, dar nu și în extratereștri, în timp ce prietenul ei, Okarun, crede în extratereștri, dar nu și în fantome...",
    score: 8.7,
 
  },
 {
  img: "src/assets/one-piece.jpeg",
  id: 21,
  alt: "One Piece Anime Poster",
  title: "One Piece",
  title_japanese: "ワンピース",
  synopsis:
    "Tânărul piraţ Monkey D. Luffy, căruia corpul îi devine de cauciuc după ce mănâncă fructul „Gomu Gomu”, îşi porneşte aventura pe mare cu echipajul său, Straw Hat Pirates, în căutarea legendarei comori „One Piece” pentru a deveni Regele Piraţilor. Împreună traversează Marea Grandă (Grand Line), se confruntă cu bătălii epice, îşi formează prietenii şi descoperă secrete vechi ale lumii.",
  score: 9.0,
},
  {
    img: "src/assets/demonSlayer.png",
    id: 38000,
    alt: "Demon Slayer Anime Poster",
    title: "Demon Slayer: Kimetsu no Yaiba",
    title_japanese: "鬼滅の刃",
    synopsis:
      "Un băiat a cărui familie este ucisă de demoni pornește într-o călătorie pentru a o salva pe sora sa, care a fost transformată într-un demon.",
    score: 8.9,

  },
];

const BannerImg = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Carousel opts={{ align: "start", loop: true }} className="h-full">
        <CarouselContent className="h-full ">
          {slideShow.map((slide) => (
            <CarouselItem key={slide.id} className="h-screen w-full p-0">
              <div
                className="relative h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.img})` }}
              >
                {/* dark veil */}
                <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/50 to-black/30" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-black to-transparent"/>

                {/* left-aligned card */}
                <div className="absolute inset-0 flex items-center left-4 sm:left-8 md:left-12 lg:left-16 xl:left-30 px-6 md:px-12">
                  <div className="max-w-2xl rounded-2xl border-none border-transparent bg-transparent text-white  ">
                    <div className="p-6 md:p-8">
                      <h1 className="mb-1 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                        {slide.title}
                      </h1>
                      <p className="mb-4 text-sm text-white/80 md:text-base">{slide.title_japanese}</p>
                      <p className="mb-6 max-w-prose text-white/90 md:text-lg">
                        {slide.synopsis}
                      </p>

                      {/* badges row */}
                      <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/15 px-4 py-2 text-sm font-semibold text-yellow-300">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-yellow-500/30">
                              <Star className="h-4 w-4" />
                            </span>
                            {slide.score}
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
        <CarouselPrevious className="left-[7vw] top-1/2 -translate-y-1/2 border-white/30 bg-black/40 text-white hover:bg-black/60" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 border-white/30 bg-black/40 text-white hover:bg-black/60" />
      </Carousel>
    </div>
  );
};


export default BannerImg;
