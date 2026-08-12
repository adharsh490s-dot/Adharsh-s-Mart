import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i - 0.25;
        const half = !filled && rating >= i - 0.75;
        return (
          <Star
            key={i}
            aria-hidden
            width={size}
            height={size}
            className={cn(
              "shrink-0",
              filled ? "fill-deal text-deal" : half ? "fill-deal/50 text-deal" : "fill-muted text-muted-foreground/40",
            )}
          />
        );
      })}
    </span>
  );
}
