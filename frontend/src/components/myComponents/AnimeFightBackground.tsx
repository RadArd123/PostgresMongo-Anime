import { useState } from "react";
import { Sparkles } from "lucide-react";

export interface FightScene {
  title: string;
  anime: string;
  url: string;
  badgeColor: string;
}

const FIGHT_SCENES: FightScene[] = [
  {
    title: "Gear 5 • Sun God Nika Awakening",
    anime: "One Piece Wano",
    url: "/gifs/one-piece.gif",
    badgeColor: "from-yellow-500 to-orange-500",
  },
  {
    title: "Sung Jinwoo • Arise Shadow Monarch",
    anime: "Solo Leveling",
    url: "/gifs/solo-leveling-2.gif",
    badgeColor: "from-cyan-500 to-blue-700",
  },
  {
    title: "Tanjiro • Hinokami Kagura Clash",
    anime: "Demon Slayer",
    url: "/gifs/demon-slayer.gif",
    badgeColor: "from-amber-500 to-red-600",
  },
  {
    title: "Flash Step • Shunpo Lightning",
    anime: "Bleach Action",
    url: "/gifs/flash-step-shunpo.gif",
    badgeColor: "from-cyan-400 to-blue-600",
  },
  {
    title: "Bakugo • Howitzer Impact",
    anime: "My Hero Academia",
    url: "/gifs/My Hero Academia Explosion GIF.gif",
    badgeColor: "from-orange-600 to-rose-600",
  },
  {
    title: "Asta & Yuno • Magic Knights",
    anime: "Black Clover",
    url: "/gifs/black clover fly GIF by Funimation.gif",
    badgeColor: "from-green-600 to-emerald-700",
  },
  {
    title: "Satoru Gojo • Limitless Awakening",
    anime: "Jujutsu Kaisen",
    url: "/gifs/jjk-gojo.gif",
    badgeColor: "from-violet-600 to-fuchsia-600",
  },
  {
    title: "Ultimate Ninja • Kurama Mode",
    anime: "Naruto Shippuden",
    url: "/gifs/naruto.gif",
    badgeColor: "from-orange-500 to-amber-600",
  },
  {
    title: "Bankai • Ultimate Clash",
    anime: "Bleach Combat",
    url: "/gifs/Fight Bleach GIF.gif",
    badgeColor: "from-red-600 to-neutral-900",
  },
  {
    title: "Legendary Clash • Conqueror Haki",
    anime: "One Piece Action",
    url: "/gifs/One Piece Anime Fight GIF.gif",
    badgeColor: "from-amber-600 to-red-700",
  },
  {
    title: "Furious Impact • Ultimate Punch",
    anime: "Anime Action",
    url: "/gifs/Angry Punch GIF by iQiyi.gif",
    badgeColor: "from-red-700 to-purple-800",
  },
  {
    title: "Divine Strike • Energy Blast",
    anime: "Divine Strike",
    url: "/gifs/Shoot Deity GIF.gif",
    badgeColor: "from-yellow-600 to-amber-700",
  },
  {
    title: "Yuji Itadori • Locked In",
    anime: "Jujutsu Kaisen",
    url: "/gifs/Locked In Jujutsu Kaisen GIF.gif",
    badgeColor: "from-indigo-600 to-blue-700",
  },
  {
    title: "Luffy & Crew • Opening 26 Clash",
    anime: "One Piece",
    url: "/gifs/one-piece-2.gif",
    badgeColor: "from-red-600 to-amber-500",
  },
  {
    title: "Fierce Combat • Heroine Clash",
    anime: "Anime Combat",
    url: "/gifs/Fight Girl GIF.gif",
    badgeColor: "from-pink-600 to-rose-700",
  },
  {
    title: "Ultimate Awakening • Legendary Clash",
    anime: "Epic Anime Moments",
    url: "/gifs/epic-fight.gif",
    badgeColor: "from-red-600 to-rose-700",
  },
  {
    title: "Epic Clash • Anime Action 5",
    anime: "Anime Highlights",
    url: "/gifs/giphy (5).gif",
    badgeColor: "from-fuchsia-600 to-purple-900",
  },
  {
    title: "Mystery Strike • Shadow Clash",
    anime: "Mystery Clash",
    url: "/gifs/spoiler comment GIF.gif",
    badgeColor: "from-purple-700 to-indigo-900",
  },
  {
    title: "Epic Clash • Anime Action 1",
    anime: "Anime Highlights",
    url: "/gifs/giphy.gif",
    badgeColor: "from-pink-500 to-purple-600",
  },
  {
    title: "Epic Clash • Anime Action 2",
    anime: "Anime Highlights",
    url: "/gifs/giphy (2).gif",
    badgeColor: "from-rose-500 to-red-700",
  },
  {
    title: "Ultimate Combo • Battle Scene",
    anime: "Ultimate Action",
    url: "/gifs/gif.gif",
    badgeColor: "from-blue-600 to-indigo-700",
  },
  {
    title: "Epic Clash • Anime Action 3",
    anime: "Anime Highlights",
    url: "/gifs/giphy (3).gif",
    badgeColor: "from-cyan-500 to-sky-700",
  },
  {
    title: "Special Highlight • Dynamic Scene",
    anime: "Anime Realm",
    url: "/gifs/200.webp",
    badgeColor: "from-indigo-500 to-blue-700",
  },
  {
    title: "Epic Clash • Anime Action 4",
    anime: "Anime Highlights",
    url: "/gifs/giphy (4).gif",
    badgeColor: "from-violet-500 to-purple-800",
  },
];

export default function AnimeFightBackground() {
  // Fisher-Yates shuffle: randomize all 24 GIF positions on every page load/refresh!
  const [gridItems] = useState(() => {
    const shuffled = [...FIGHT_SCENES];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#02040a] pointer-events-auto">
      {/* Seamless Video Wall (no gaps, no padding, glued together! All 24 unique items) */}
      <div className="w-full h-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-0 p-0 m-0 bg-black opacity-100 overflow-hidden">
        {gridItems.map((scene, idx) => (
          <div
            key={`${scene.url}-${idx}`}
            className="relative overflow-hidden bg-black group hover:z-20 hover:scale-105 transition-all duration-300"
          >
            <img
              src={encodeURI(scene.url)}
              alt={scene.title}
              className="w-full h-full object-cover block scale-[1.01] filter brightness-100 contrast-105 group-hover:brightness-110 transition-all duration-300"
            />
            {/* Subtle bottom gradient only for badge legibility on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 shadow-md">
              <Sparkles className="size-3 text-blue-400 shrink-0" />
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wider truncate max-w-[120px]">
                {scene.anime}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Center Dark Vignette (dark center for floating text/inputs legibility without any box border) */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(2,4,10,0.88)_15%,rgba(2,4,10,0.45)_65%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#02040a]/70 via-transparent to-[#02040a]/70 pointer-events-none" />

      {/* Subtle Neon Color Glow on center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-500/[0.08] blur-[150px] rounded-full pointer-events-none z-15" />
    </div>
  );
}
