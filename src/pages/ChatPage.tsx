import { AlertCircle } from "lucide-react"

import { ChatHeader } from "@/components/layout/ChatHeader"
import { ChatInput } from "@/features/chat/components/ChatInput"
import { MessageList } from "@/features/chat/components/MessageList"
import { useChat } from "@/features/chat/hooks/useChat"

export function ChatPage() {
  const {
    messages,
    isResponding,
    isLoadingHistory,
    error,
    sendMessage,
    clearChat,
  } = useChat()

  const isAssistantStreaming =
    messages.at(-1)?.role === "assistant" &&
    messages.at(-1)?.status === "sending"

  const isBusy = isResponding || isLoadingHistory

  return (
    <div className="flex h-svh flex-col bg-muted/30">
      <ChatHeader onClearChat={clearChat} />

      <main className="min-h-0 flex-1">
        <MessageList
          messages={messages}
          isResponding={
            isBusy && !isAssistantStreaming
          }
        />
      </main>

      {error && (
        <div
          role="alert"
          className="border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-destructive"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-2 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        </div>
      )}

      <ChatInput
        isResponding={isBusy}
        onSendMessage={sendMessage}
      />
    </div>
  )
}