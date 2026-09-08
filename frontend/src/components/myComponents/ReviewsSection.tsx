import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useReviewsStore } from "@/store/reviewsStore";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  StarIcon, MessageSquareIcon, Trash2Icon, SendIcon, TrendingUpIcon, UsersIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewsSectionProps {
  anime: { title: string };
}

/* ── StarIcon rating helpers ────────────────────────── */
const StarRating = ({
  value,
  onChange,
  readonly = false,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}) => {
  const [hov, setHov] = useState(0);
  const active = hov || value;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !readonly && setHov(s)}
          onMouseLeave={() => !readonly && setHov(0)}
          className={cn(
            "transition-transform",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <StarIcon
            size={size}
            className={cn(
              "transition-colors",
              s <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  );
};

/* ── Average score ring ─────────────────────────── */
const ScoreRing = ({ score }: { score: number }) => {
  const pct = (score / 5) * 100;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="relative size-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="white" strokeOpacity={0.06} strokeWidth="5" />
        <motion.circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <p className="text-xl font-black text-white leading-none">{score.toFixed(1)}</p>
        <p className="text-[9px] text-muted-foreground font-mono">/5</p>
      </div>
    </div>
  );
};

/* ── Main component ─────────────────────────────── */
const ReviewsSection = ({ anime }: ReviewsSectionProps) => {
  const { currentAnimeReviews, fetchReviewsByAnimeId, createReview, isLoading, deleteReview } =
    useReviewsStore();
  const { isAdmin, isAuthenticated } = useAuthStore();
  const animeId = useParams().id;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (animeId) fetchReviewsByAnimeId?.(Number(animeId));
  }, [animeId, fetchReviewsByAnimeId]);

  const avgRating =
    currentAnimeReviews.length > 0
      ? currentAnimeReviews.reduce((acc: number, r: any) => acc + Number(r.rating), 0) /
        currentAnimeReviews.length
      : 0;

  /* Rating distribution */
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: currentAnimeReviews.filter((r: any) => Number(r.rating) === star).length,
    pct:
      currentAnimeReviews.length > 0
        ? (currentAnimeReviews.filter((r: any) => Number(r.rating) === star).length /
            currentAnimeReviews.length) *
          100
        : 0,
  }));

  const handleSubmit = async () => {
    if (!createReview || !animeId || rating === 0 || !comment.trim()) return;
    setIsSubmitting(true);
    try {
      await createReview({ rating, comment: comment.trim(), anime_id: Number(animeId) });
      setComment("");
      setRating(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full space-y-6">
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-amber-400" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 font-mono">
              Recenzii Comunitate
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Recenzii
            <span className="ml-3 text-lg font-normal text-muted-foreground">
              ({currentAnimeReviews.length})
            </span>
          </h2>
        </div>
        <Badge variant="secondary" className="gap-1.5 text-xs">
          <UsersIcon size={12} />
          {currentAnimeReviews.length} votanți
        </Badge>
      </div>

      <Separator className="bg-white/5" />

      {/* ── Score Overview ──────────────────────────── */}
      {currentAnimeReviews.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          {/* Ring */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <ScoreRing score={avgRating} />
            <StarRating value={Math.round(avgRating)} readonly size={13} />
          </div>

          <Separator orientation="vertical" className="hidden sm:block h-16 bg-white/5" />

          {/* Distribution bars */}
          <div className="flex-1 w-full space-y-1.5">
            {dist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2.5">
                <span className="text-[11px] text-muted-foreground w-3 font-mono">{star}</span>
                <StarIcon size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground w-4 font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Reviews List ────────────────────────────── */}
      <ScrollArea className="h-[380px]">
        <div className="pr-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))
          ) : currentAnimeReviews.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3 text-center">
              <div className="size-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                <MessageSquareIcon size={24} className="text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Niciun review încă</p>
                <p className="text-xs text-muted-foreground">
                  Fii primul care își împărtășește părerea despre{" "}
                  <span className="text-white font-semibold">{anime.title}</span>
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {currentAnimeReviews.map((review: any, idx: number) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar — always needs AvatarFallback per shadcn skill */}
                      <Avatar className="size-9 border border-white/10">
                        <AvatarImage src={review.avatar_url} alt={review.username} className="object-cover" />
                        <AvatarFallback className="bg-blue-600/20 text-blue-300 text-xs font-bold">
                          {review.username ? review.username[0].toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-white leading-none mb-1">
                          {review.username || "Utilizator șters"}
                        </p>
                        <StarRating value={Number(review.rating)} readonly size={12} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {review.date
                          ? new Date(review.date).toLocaleDateString("ro-RO", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : new Date().toLocaleDateString()}
                      </span>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReview?.(review.id)}
                          className="size-7 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2Icon size={13} />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-muted-foreground leading-relaxed pl-[2.875rem]">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      <Separator className="bg-white/5" />

      {/* ── Write Review Form ───────────────────────── */}
      {isAuthenticated ? (
        <div className="space-y-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <TrendingUpIcon size={15} className="text-blue-400" />
            <p className="text-sm font-bold text-white">Scrie recenzia ta</p>
          </div>

          {/* StarIcon picker */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Rating-ul tău</p>
            <StarRating value={rating} onChange={setRating} size={22} />
          </div>

          {/* Comment textarea */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Gândurile tale</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Împărtășește-ți gândurile despre ${anime.title}...`}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              {comment.length > 0 ? `${comment.length} caractere` : "Min. 10 caractere"}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !comment.trim() || rating === 0 || comment.length < 10}
              size="sm"
              className="gap-2 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Se postează...
                </>
              ) : (
                <>
                  <SendIcon size={13} />
                  Publică Recenzia
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-sm text-muted-foreground">
            <span className="text-white font-semibold">Autentifică-te</span> pentru a lăsa o recenzie
          </p>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
