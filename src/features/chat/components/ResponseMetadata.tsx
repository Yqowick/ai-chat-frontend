import { useState } from "react"
import {
  ChevronDown,
  Clock3,
  Database,
  FileText,
  GitBranch,
  MessageSquareText,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"

import type { ChatMessage } from "@/features/chat/types/chat"
import { cn } from "@/lib/utils"

interface ResponseMetadataProps {
  message: ChatMessage
}

function formatGeneratedTime(
  createdAt: string,
) {
  const generatedAt = new Date(createdAt)

  if (Number.isNaN(generatedAt.getTime())) {
    return "Unknown"
  }

  return new Intl.DateTimeFormat([], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(generatedAt)
}

function countWords(content: string) {
  const normalizedContent = content.trim()

  if (!normalizedContent) {
    return 0
  }

  return normalizedContent
    .split(/\s+/)
    .filter(Boolean).length
}

function getFeedbackLabel(
  message: ChatMessage,
) {
  if (message.feedback?.rating === "up") {
    return "Helpful"
  }

  if (message.feedback?.rating === "down") {
    return "Needs improvement"
  }

  return "Not rated"
}

export function ResponseMetadata({
  message,
}: ResponseMetadataProps) {
  const [isOpen, setIsOpen] =
    useState(false)

  const versions = message.versions ?? []

  const versionCount = Math.max(
    versions.length,
    1,
  )

  const activeVersionNumber = Math.min(
    (message.activeVersionIndex ?? 0) + 1,
    versionCount,
  )

  const wordCount = countWords(
    message.content,
  )

  const characterCount =
    message.content.length

  const feedbackLabel =
    getFeedbackLabel(message)

  return (
    <div className="mt-2 overflow-hidden rounded-lg border bg-muted/20">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
        onClick={() =>
          setIsOpen((currentValue) =>
            !currentValue,
          )
        }
        aria-expanded={isOpen}
        aria-label="Toggle response metadata"
      >
        <span className="flex items-center gap-2">
          <Database className="size-3.5" />
          Response metadata
        </span>

        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="grid gap-3 border-t px-3 py-3 text-xs sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Database className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

            <div>
              <p className="font-medium">
                AI provider
              </p>

              <p className="mt-0.5 text-muted-foreground">
                Gemini API
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock3 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

            <div>
              <p className="font-medium">
                Generated
              </p>

              <p className="mt-0.5 text-muted-foreground">
                {formatGeneratedTime(
                  message.createdAt,
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

            <div>
              <p className="font-medium">
                Response length
              </p>

              <p className="mt-0.5 text-muted-foreground">
                {wordCount} words ·{" "}
                {characterCount} characters
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <GitBranch className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

            <div>
              <p className="font-medium">
                Active version
              </p>

              <p className="mt-0.5 text-muted-foreground">
                {activeVersionNumber} of{" "}
                {versionCount}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            {message.feedback?.rating ===
            "up" ? (
              <ThumbsUp className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
            ) : message.feedback?.rating ===
              "down" ? (
              <ThumbsDown className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            ) : (
              <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            )}

            <div>
              <p className="font-medium">
                Feedback
              </p>

              <p className="mt-0.5 text-muted-foreground">
                {feedbackLabel}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="font-medium">
                Message ID
              </p>

              <p
                className="mt-0.5 truncate font-mono text-muted-foreground"
                title={message.id}
              >
                {message.id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}