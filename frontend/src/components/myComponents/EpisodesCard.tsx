import type { Anime } from "@/interfaces/anime.types";
import type { Episode } from "@/interfaces/episodes.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  PlayIcon, VideoIcon, TvIcon, ClockIcon, ChevronRightIcon, LayoutGridIcon, ListIcon,
  ChevronLeftIcon, SearchIcon, XIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface EpisodesCardProps {
  episodesById: Episode[];
  anime?: Anime;
  onEpisodeClick?: (episode: Episode) => void;
}

const PAGE_SIZE_GRID = 12;
const PAGE_SIZE_LIST = 20;

const EpisodesCard = ({ episodesById, onEpisodeClick, anime }: EpisodesCardProps) => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hovered, setHovered] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const pageSize = view === "grid" ? PAGE_SIZE_GRID : PAGE_SIZE_LIST;

  /* Filter by search */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return episodesById;
    return episodesById.filter(
      (ep) =>
        ep.title?.toLowerCase().includes(q) ||
        String(ep.episode_number).includes(q)
    );
  }, [episodesById, search]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  /* Reset to page 1 when search or view changes */
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleView = (v: "grid" | "list") => { setView(v); setPage(1); };

  const handleClick = (ep: Episode) => {
    if (onEpisodeClick) onEpisodeClick(ep);
    else navigate(`/anime/episode/${ep.id}`);
  };

  /* Page number pills — show max 5 */
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  }, [safePage, totalPages]);

  return (
    <section className="w-full space-y-5">
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400 font-mono flex items-center gap-1.5">
              <TvIcon size={11} /> Ghid de Vizionare
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Episoade
            <span className="ml-3 text-lg font-normal text-muted-foreground">
              ({episodesById.length})
            </span>
          </h2>
        </div>

        {/* View toggle */}
        <div role="group" aria-label="Mod de afișare a episoadelor" className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {(["grid", "list"] as const).map((mode) => (
            <Tooltip key={mode} delayDuration={250}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={mode === "grid" ? "Afișare grilă" : "Afișare listă"}
                  aria-pressed={view === mode}
                  onClick={() => handleView(mode)}
                  className={cn(
                    "size-10 rounded-lg transition-all focus-visible:ring-blue-400/60",
                    view === mode
                      ? "bg-blue-600 hover:bg-blue-600 text-white hover:text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  {mode === "grid" ? <LayoutGridIcon size={15} /> : <ListIcon size={15} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                {mode === "grid" ? "Afișare grilă" : "Afișare listă"}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* ── SearchIcon bar ──────────────────────────────── */}
      {episodesById.length > 0 && (
        <div className="relative">
          <SearchIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            aria-label="Caută episoade după titlu sau număr"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Caută după titlul sau numărul episodului…"
            className="h-11 pl-9 pr-11 bg-white/[0.03] border-white/10 focus-visible:border-blue-500/50 placeholder:text-muted-foreground/50 text-sm"
          />
          {search && (
            <button
              type="button"
              aria-label="Șterge căutarea"
              onClick={() => handleSearch("")}
              className="absolute right-0 top-0 size-11 flex items-center justify-center rounded-md text-muted-foreground hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <XIcon size={14} />
            </button>
          )}
        </div>
      )}

      <Separator className="bg-white/5" />

      {/* ── Result count ────────────────────────────── */}
      {search && (
        <p role="status" className="text-xs text-muted-foreground">
          {filtered.length === 0
            ? "Niciun episod nu corespunde căutării"
            : `${filtered.length} episod${filtered.length !== 1 ? "e" : ""} găsite`}
        </p>
      )}

      {/* ── Episodes ────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {episodesById.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 flex flex-col items-center gap-4 text-center"
          >
            <div className="size-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <VideoIcon size={28} className="text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Niciun episod încă</p>
              <p className="text-xs text-muted-foreground">Episoadele vor apărea aici după încărcare.</p>
            </div>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 flex flex-col items-center gap-3 text-center"
          >
            <SearchIcon size={28} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Niciun rezultat pentru <span className="text-white">"{search}"</span></p>
            <Button variant="ghost" size="sm" onClick={() => handleSearch("")} className="text-blue-400 hover:text-blue-300">
              Șterge căutarea
            </Button>
          </motion.div>
        ) : view === "grid" ? (
          /* ── GRID ──────────────────────────────────── */
          <motion.div
            key={`grid-${safePage}-${search}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {paginated.map((ep, idx) => (
              <motion.button
                type="button"
                key={ep.id}
                aria-label={`Vizionează episodul ${ep.episode_number}: ${ep.title || "Fără titlu"}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onHoverStart={() => setHovered(ep.id)}
                onHoverEnd={() => setHovered(null)}
                onFocus={() => setHovered(ep.id)}
                onBlur={() => setHovered(null)}
                onClick={() => handleClick(ep)}
                className="group relative min-w-0 text-left rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0e0f14] hover:border-blue-500/40 shadow-md hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0f14]"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={anime?.img_url_banner || anime?.img_url_icon || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600"}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f14] via-[#0e0f14]/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-2 py-0.5 gap-1">
                      <VideoIcon size={10} className="text-blue-400" />
                      EP {ep.episode_number}
                    </Badge>
                  </div>

                  {ep.duration ? (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-black/70 backdrop-blur-md border border-white/20 text-muted-foreground text-[10px] gap-1">
                        <ClockIcon size={9} />
                        {ep.duration}m
                      </Badge>
                    </div>
                  ) : null}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hovered === ep.id ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: hovered === ep.id ? 1 : 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="size-14 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.8)]"
                    >
                      <PlayIcon size={22} className="fill-white text-white translate-x-0.5" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {ep.title || `Episode ${ep.episode_number}`}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[60%]">{anime?.title}</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 group-hover:gap-1.5 transition-all">
                      Vizionează <ChevronRightIcon size={12} />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          /* ── LIST ──────────────────────────────────── */
          <motion.div
            key={`list-${safePage}-${search}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2"
          >
            {paginated.map((ep, idx) => (
              <motion.button
                type="button"
                key={ep.id}
                aria-label={`Vizionează episodul ${ep.episode_number}: ${ep.title || "Fără titlu"}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.025 }}
                onClick={() => handleClick(ep)}
                className="group flex min-w-0 text-left items-center gap-4 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <div className="relative size-16 shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={anime?.img_url_icon || anime?.img_url_banner || ""}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <PlayIcon size={14} className="fill-white text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] font-black text-blue-400 border-blue-500/30 px-1.5 py-0">
                      EP {ep.episode_number}
                    </Badge>
                    {ep.duration ? (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <ClockIcon size={9} /> {ep.duration}m
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                    {ep.title || `Episode ${ep.episode_number}`}
                  </p>
                </div>

                <ChevronRightIcon size={16} className="text-muted-foreground group-hover:text-blue-400 shrink-0 transition-colors" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pagination ──────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-muted-foreground">
            Se afișează{" "}
            <span className="text-white font-semibold">
              {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}
            </span>{" "}
            din <span className="text-white font-semibold">{filtered.length}</span> episoade
          </p>

          <nav aria-label="Paginarea episoadelor" className="flex flex-wrap items-center gap-1">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              aria-label="Pagina anterioară"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="size-8 rounded-lg border-white/10 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-30"
            >
              <ChevronLeftIcon size={14} />
            </Button>

            {/* Page numbers */}
            {pageNumbers.map((n) => (
              <Button
                key={n}
                variant={n === safePage ? "default" : "outline"}
                size="icon"
                aria-label={`Pagina ${n}`}
                aria-current={n === safePage ? "page" : undefined}
                onClick={() => setPage(n)}
                className={cn(
                  "size-8 rounded-lg text-xs font-bold transition-all",
                  n === safePage
                    ? "bg-blue-600 hover:bg-blue-500 border-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-muted-foreground hover:text-white"
                )}
              >
                {n}
              </Button>
            ))}

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              aria-label="Pagina următoare"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="size-8 rounded-lg border-white/10 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-30"
            >
              <ChevronRightIcon size={14} />
            </Button>
          </nav>
        </div>
      )}
    </section>
  );
};

export default EpisodesCard;
