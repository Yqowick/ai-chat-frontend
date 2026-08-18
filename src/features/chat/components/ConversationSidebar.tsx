import {
  History,
  LoaderCircle,
  MessageSquareText,
  Plus,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ConversationSummary } from "@/features/chat/types/chat"
import { cn } from "@/lib/utils"

interface ConversationSidebarProps {
  conversations: ConversationSummary[]
  activeConversationId: string | null
  isLoading: boolean
  isBusy: boolean
  onNewConversation: () => void
  onSelectConversation: (
    conversationId: string,
  ) => void
  onClose?: () => void
}

function formatConversationDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const today = new Date()

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()

  if (isToday) {
    return new Intl.DateTimeFormat([], {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
  }).format(date)
}

function createMessagePreview(
  conversation: ConversationSummary,
) {
  const content =
    conversation.lastMessage?.content
      .replace(/\s+/g, " ")
      .trim() || "No messages yet"

  if (content.length <= 72) {
    return content
  }

  return `${content.slice(0, 69)}...`
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  isLoading,
  isBusy,
  onNewConversation,
  onSelectConversation,
  onClose,
}: ConversationSidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold">
              Conversations
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Resume previous chats
            </p>
          </div>

          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close conversations"
              title="Close conversations"
            >
              <X className="size-5" />
            </Button>
          )}
        </div>

        <Button
          type="button"
          className="w-full justify-start"
          onClick={onNewConversation}
          disabled={isBusy}
        >
          <Plus className="size-4" />
          New conversation
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-2 px-4 pb-2 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <History className="size-3.5" />
          Recent chats
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-1 px-2 pb-4">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <MessageSquareText className="mx-auto size-7 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">
                  No conversations yet
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your saved conversations will appear here.
                </p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const isActive =
                  conversation.conversationId ===
                  activeConversationId

                return (
                  <button
                    key={conversation.conversationId}
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      onSelectConversation(
                        conversation.conversationId,
                      )
                    }
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                      isActive &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm font-medium">
                        {conversation.title}
                      </p>

                      <time className="shrink-0 text-[10px] text-muted-foreground">
                        {formatConversationDate(
                          conversation.updatedAt,
                        )}
                      </time>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {createMessagePreview(conversation)}
                    </p>

                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      {conversation.messageCount}{" "}
                      {conversation.messageCount === 1
                        ? "message"
                        : "messages"}
                    </p>
                  </button>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}