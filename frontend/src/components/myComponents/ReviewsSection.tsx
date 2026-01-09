import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useReviewsStore } from "@/store/reviewsStore";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface ReviewsSidebarProps {
  anime: {
    title: string;
  };
}

const ReviewsSection = ({ anime }: ReviewsSidebarProps) => {
  const {currentAnimeReviews, fetchReviewsByAnimeId, createReview, isLoading, deleteReview} = useReviewsStore();
  const { isAdmin } = useAuthStore();

  const animeId = useParams().id;
  console.log("Anime prop in ReviewsSection:", animeId);
  console.log("Anime ID in ReviewsSection:", animeId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!fetchReviewsByAnimeId) return;

    if (animeId) {
      fetchReviewsByAnimeId(Number(animeId));
    }
  }, [animeId, fetchReviewsByAnimeId]);

  const handleDeleteReview = async (id: number) => {
    if (!deleteReview) return;
    try {
      await deleteReview(id);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };
  
  const handleCreateReview = async () => {
    setIsSubmitting(true);
    if (!createReview || !animeId) return;

    try {
      await createReview({
        rating,
        comment: comment,
        anime_id: Number(animeId),
      });

      // Resetează formularul
      setComment("");
      setRating(0);
    } catch (error) {
      console.error("Failed to create review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-3 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Recenzii și păreri
          </h2>
          <p className="text-xs text-slate-300/80">
            Ce părere au oamenii despre{" "}
            <span className="font-semibold text-slate-100">{anime.title}</span>
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <ScrollArea className="h-96 pr-2">
        <div className="flex max-h-72 flex-col gap-3 pr-4">
          {isLoading ? (
            <div className="flex justify-center p-4 text-slate-400">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : currentAnimeReviews.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-4">
              Nu există recenzii încă. Fii primul care scrie!
            </p>
          ) : (
            currentAnimeReviews.map((review: any) => (
              <div
                key={review.id}
                className="group relative rounded-2xl bg-slate-900/40 p-[3px] transition-colors duration-200 hover:bg-slate-900/60"
              >
                <div className="rounded-2xl px-3 py-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-slate-950">
                        {review.user ? review.user[0].toUpperCase() : "A"}
                      </div>
                      <span className="text-xs font-semibold text-slate-100">
                        {review.user || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[0.65rem] text-slate-400">
                        {review.date || new Date().toLocaleDateString()}
                      </span>
                      <span>
                        {isAdmin && <Button variant="ghost" className="text-red-500" onClick={() => handleDeleteReview(review.id)}>Delete</Button>}
                      </span>
                    </div>
                  </div>

                  {/* Display Stars */}
                  <div className="mb-1 flex items-center gap-1 text-[0.7rem] text-yellow-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-200/90">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Comment Form */}
      <div className="mt-1 border-t border-slate-800/80 pt-2">
        <div className="mb-3 flex flex-col gap-2">
          <p className="text-xs text-slate-300/90">Rate this anime:</p>
          {/* Interactive Rating Input */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-lg transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-slate-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <p className="mb-2 text-xs text-slate-300/90">
          Leave your own comment:
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this anime..."
          className="h-20 w-full resize-none rounded-2xl border border-slate-700/70 bg-slate-900/40 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
        />
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting || !comment || rating === 0}
            className="rounded-full px-4 py-1.5 text-sm font-semibold text-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleCreateReview()}
          >
            {isSubmitting ? "Posting..." : "Post comment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
