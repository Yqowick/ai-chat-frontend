import {
  useEffect,
  useState,
} from "react"
import {
  LoaderCircle,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import type { FeedbackRating } from "@/features/chat/types/chat"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
  isOpen: boolean
  rating: FeedbackRating | null
  initialComment: string
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (comment: string) => void
}

export function FeedbackModal({
  isOpen,
  rating,
  initialComment,
  isSubmitting,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [comment, setComment] = useState(
    initialComment,
  )

  useEffect(() => {
    if (isOpen) {
      setComment(initialComment)
    }
  }, [
    initialComment,
    isOpen,
    rating,
  ])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose()
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      )
    }
  }, [
    isOpen,
    isSubmitting,
    onClose,
  ])

  if (!isOpen || !rating) {
    return null
  }

  const isPositiveRating = rating === "up"

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    onSubmit(comment.trim())
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
        disabled={isSubmitting}
        aria-label="Close feedback dialog"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl border bg-background p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                isPositiveRating
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {isPositiveRating ? (
                <ThumbsUp className="size-5" />
              ) : (
                <ThumbsDown className="size-5" />
              )}
            </div>

            <div>
              <h2
                id="feedback-modal-title"
                className="font-semibold"
              >
                {isPositiveRating
                  ? "What was helpful?"
                  : "What could be improved?"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your feedback helps improve future
                responses.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close feedback dialog"
            title="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <label
          htmlFor="feedback-comment"
          className="mt-5 block text-sm font-medium"
        >
          Comment
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        </label>

        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
          maxLength={1000}
          rows={5}
          placeholder={
            isPositiveRating
              ? "Tell us what you liked about this response..."
              : "Tell us what was missing or incorrect..."
          }
          disabled={isSubmitting}
          autoFocus
          className="mt-2 w-full resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="mt-1 text-right text-xs text-muted-foreground">
          {comment.length} / 1000
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting && (
              <LoaderCircle className="size-4 animate-spin" />
            )}

            {isSubmitting
              ? "Saving..."
              : "Submit feedback"}
          </Button>
        </div>
      </form>
    </div>
  )
}