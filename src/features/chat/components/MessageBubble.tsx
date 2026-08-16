import {
  AlertCircle,
  Bot,
  LoaderCircle,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { ChatMessage } from "@/features/chat/types/chat"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: ChatMessage
}

function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
}

export function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUserMessage = message.role === "user"

  return (
    <article
      className={cn(
        "flex w-full items-start gap-3",
        isUserMessage && "flex-row-reverse",
      )}
    >
      <Avatar className="size-9 shrink-0">
        <AvatarFallback
          className={cn(
            isUserMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isUserMessage ? (
            <User className="size-4" />
          ) : (
            <Bot className="size-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] sm:max-w-[70%]",
          isUserMessage && "items-end",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUserMessage
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm border bg-card text-card-foreground",
          )}
        >
          <p className="whitespace-pre-wrap leading-6">
            {message.content}
          </p>

          {message.sources && message.sources.length > 0 && (
            <div className="mt-3">
              <Separator className="mb-3" />

              <p className="mb-2 text-xs font-medium">
                Sources
              </p>

              <ul className="space-y-1">
                {message.sources.map((source, index) => (
                  <li
                    key={`${source.title}-${index}`}
                    className="text-xs opacity-80"
                  >
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-1.5 flex items-center gap-1.5 px-1 text-xs text-muted-foreground",
            isUserMessage && "justify-end",
          )}
        >
          <time dateTime={message.createdAt}>
            {formatMessageTime(message.createdAt)}
          </time>

          {message.status === "sending" && (
            <LoaderCircle className="size-3 animate-spin" />
          )}

          {message.status === "error" && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertCircle className="size-3" />
              Failed
            </span>
          )}
        </div>
      </div>
    </article>
  )
}