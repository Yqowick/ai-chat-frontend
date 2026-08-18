import {
  useEffect,
  useRef,
} from "react"
import {
  Bot,
  LoaderCircle,
  MessageSquareText,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "@/features/chat/components/MessageBubble"
import type { ChatMessage } from "@/features/chat/types/chat"

type MessageActionType =
  | "regenerate"
  | "switch-version"
  | null

interface MessageListProps {
  messages: ChatMessage[]
  conversationId: string | null
  isResponding: boolean
  activeMessageActionId: string | null
  messageActionType: MessageActionType
  onRegenerateMessage: (
    messageId: string,
  ) => void
  onSwitchMessageVersion: (
    messageId: string,
    versionIndex: number,
  ) => void
}

export function MessageList({
  messages,
  conversationId,
  isResponding,
  activeMessageActionId,
  messageActionType,
  onRegenerateMessage,
  onSwitchMessageVersion,
}: MessageListProps) {
  const bottomReference =
    useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomReference.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [
    messages,
    isResponding,
    activeMessageActionId,
  ])

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <MessageSquareText className="size-7 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Start a new conversation
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Ask a question about your documents and the
              AI assistant will provide an answer with
              relevant sources.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                conversationId={conversationId}
                isActionLoading={
                  activeMessageActionId ===
                  message.id
                }
                messageActionType={
                  messageActionType
                }
                onRegenerate={
                  onRegenerateMessage
                }
                onSwitchVersion={
                  onSwitchMessageVersion
                }
              />
            ))}

            {isResponding && (
              <div className="flex items-start gap-3">
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <Bot className="size-4" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                  <LoaderCircle className="size-4 animate-spin" />
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
        )}

        <div
          ref={bottomReference}
          aria-hidden="true"
        />
      </div>
    </ScrollArea>
  )
}