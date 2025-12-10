import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingDisplayProps {
  rating: number
  totalRatings?: number
  showCount?: boolean
  size?: "sm" | "md" | "lg"
}

export function RatingDisplay({ rating, totalRatings, showCount = false, size = "md" }: RatingDisplayProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "font-medium",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base",
        )}
      >
        {rating.toFixed(1)}
      </span>
      {showCount && totalRatings !== undefined && (
        <span
          className={cn(
            "text-muted-foreground",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          ({totalRatings})
        </span>
      )}
    </div>
  )
}
