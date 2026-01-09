import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark} from "lucide-react";
import { useNavigate } from "react-router-dom";

const continueWatchingAnime = [
  {
    id: 1,
    name: "Jujutsu Kaisen S2",
    currentEpisode: "Episodul 18",
    imageUrl: "src/assets/onepiece1.jpg",
  },
  {
    id: 2,
    name: "Attack on Titan",
    currentEpisode: "Final Season, Partea 3",
    imageUrl: "src/assets/one-piece.jpeg",
  },
  {
    id: 3,
    name: "Vinland Saga",
    currentEpisode: "Sezonul 2, Episodul 5",
    imageUrl: "src/assets/Dandadan.jpg",
  },
  {
    id: 4,
    name: "Solo Leveling",
    currentEpisode: "Ep. 7",
    imageUrl: "src/assets/onepiece1.jpg",
  },
  {
    id: 5,
    name: "Dandadan",
    currentEpisode: "Ep. 3",
    imageUrl: "src/assets/Dandadan.jpg",
  },
  {
    id: 6,
    name: "One Piece",
    currentEpisode: "Ep. 1120",
    imageUrl: "src/assets/one-piece.jpeg",
  },
];

type AnimeSidebarProps = {
  collapsed?: boolean;
  loading?: boolean;
};


type LibraryHeaderProps = {
  collapsed?: boolean;
};

const LibraryHeader = ({ collapsed }: LibraryHeaderProps) => (
  <div data-collapsed={collapsed} className="px-4 pt-4 pb-2">
    <h2
      className={[
        "text-xl font-bold tracking-tight",
        "group-data-[collapsed=true]/sidebar:hidden",
      ].join(" ")}
    >
      Your Library
    </h2>
    <div className="hidden group-data-[collapsed=true]/sidebar:flex items-center justify-center py-1">
      <span className="h-1.5 w-6 rounded-full bg-neutral-700" />
    </div>
  </div>
);

const LibraryActions = () => {
  const navigate = useNavigate();
  return (
  <div className="px-3 group-data-[collapsed=true]/sidebar:px-2">
    <div className="flex gap-2 group-data-[collapsed=true]/sidebar:flex-col">
      <Button onClick={() => navigate('/favorites')}
        variant="secondary"
        className="h-8 shrink-0 rounded-full  bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/60 "
      >
        <Heart className=" h-4 "  />
        <span className="group-data-[collapsed=true]/sidebar:hidden">
          Go to Favorites
        </span>
      </Button>
      <Button
        onClick={() => navigate('/watchlist')}
        variant="secondary"
        className="h-8 shrink-0 rounded-full bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700/80 border border-neutral-700/60"
      >
        <Bookmark className="h-4 " />
        <span className="group-data-[collapsed=true]/sidebar:hidden">
          Go to Watchlist
        </span>
      </Button>
    </div>
  </div>
);
};



// Continue Watching 


type ContinueWatchingSectionProps = {
  loading?: boolean;
  animeList: typeof continueWatchingAnime;
};

const ContinueWatchingSection = ({
  loading = false,
  animeList,
}: ContinueWatchingSectionProps) => {
  return (
    <div className="flex flex-1 min-h-0 flex-col px-3 pb-3">
      <div className="flex items-center justify-between pr-1">
        <h3 className="text-lg font-semibold text-neutral-300 group-data-[collapsed=true]/sidebar:hidden">
          Continuați Vizionarea
        </h3>
        {/* Small dot when collapsed */}
        <div className="hidden group-data-[collapsed=true]/sidebar:block h-1.5 w-1.5 rounded-full bg-neutral-700" />
      </div>

      <ScrollArea className="mt-4 min-h-0">
        <ul className="space-y-1">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 px-1 py-2 rounded-md"
                >
                  <Skeleton className="h-14 w-14 rounded-md" />
                  <div className="flex-1 space-y-2 group-data-[collapsed=true]/sidebar:hidden">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </li>
              ))
            : animeList.map((anime) => (
                <li
                  key={anime.id}
                  className="flex items-center gap-3 rounded-md py-2 px-1 hover:bg-neutral-800/70 transition-colors"
                >
                  <div className="size-12 md:size-14 lg:size-16 overflow-hidden rounded-md bg-neutral-800 group-data-[collapsed=true]/sidebar:mx-auto">
                    <img
                      src={anime.imageUrl}
                      alt={anime.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 group-data-[collapsed=true]/sidebar:hidden">
                    <p className="text-[13px] md:text-sm lg:text-base font-medium text-neutral-100 truncate">
                      {anime.name}
                    </p>
                    <p className="text-[11px] md:text-xs text-neutral-400 truncate">
                      {anime.currentEpisode}
                    </p>
                    <span className="mt-1 block w-24 h-0.5 bg-red-600 rounded-full" />
                  </div>
                </li>
              ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

// Recently Added (can also be its own file if you want)


type RecentlyAddedSectionProps = {
  animeList: typeof continueWatchingAnime;
};

const RecentlyAddedSection = ({ animeList }: RecentlyAddedSectionProps) => {
  const items = animeList.slice(0, 1);

  return (
    <div className="flex flex-col px-3 pb-3">
      <h3 className="text-lg font-semibold text-neutral-300 group-data-[collapsed=true]/sidebar:hidden">
        Recent Adăugat în Watchlist
      </h3>
      <div className="hidden group-data-[collapsed=true]/sidebar:block h-1.5 w-1.5 rounded-full bg-neutral-700" />

      {items.map((anime) => (
        <div
          key={anime.id}
          className="flex items-center gap-4 mt-6 group-data-[collapsed=true]/sidebar:mx-auto"
        >
          <img
            src={anime.imageUrl}
            alt={anime.name}
            className="h-16 w-30 2xl:h-25 2xl:w-40 rounded-md object-cover group-data-[collapsed=true]/sidebar:h-16 group-data-[collapsed=true]/sidebar:w-16"
          />
          <span className="text-sm font-medium text-neutral-300 truncate group-data-[collapsed=true]/sidebar:hidden">
            {anime.name}
          </span>
        </div>
      ))}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Main sidebar, now composed out of smaller components
// ──────────────────────────────────────────────────────────────────────────────

const AnimeSidebar = ({ collapsed = false, loading = false }: AnimeSidebarProps) => {
  return (
    <aside
      data-collapsed={collapsed}
      className={[
        "group/sidebar relative hidden lg:block h-[98%] min-h-[60vh] bg-neutral-900/70 backdrop-blur",
        "w-full transition-[width] duration-300 ease-in-out",
        "rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden",
        "flex flex-col m-1",
      ].join(" ")}
    >
      <div className="h-full flex flex-col text-neutral-200">
        <LibraryHeader collapsed={collapsed} />
        <LibraryActions />
       

        {/* Divider */}
        <div className="my-3 h-px bg-neutral-900 group-data-[collapsed=true]/sidebar:mx-3" />

        {/* Continue Watching */}
        <ContinueWatchingSection
          loading={loading}
          animeList={continueWatchingAnime}
        />

        {/* Recently Added */}
        <RecentlyAddedSection animeList={continueWatchingAnime} />
      </div>
    </aside>
  );
};

export default AnimeSidebar;
