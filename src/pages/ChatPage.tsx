import { AlertCircle } from "lucide-react"

import { ChatHeader } from "@/components/layout/ChatHeader"
import { ChatInput } from "@/features/chat/components/ChatInput"
import { MessageList } from "@/features/chat/components/MessageList"
import { useChat } from "@/features/chat/hooks/useChat"

export function ChatPage() {
  const {
    messages,
    isResponding,
    error,
    sendMessage,
    clearChat,
  } = useChat()

  return (
    <div className="flex h-svh flex-col bg-muted/30">
      <ChatHeader onClearChat={clearChat} />

      <main className="min-h-0 flex-1">
        <MessageList
          messages={messages}
          isResponding={isResponding}
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
        isResponding={isResponding}
        onSendMessage={sendMessage}
      />
    </div>
  )
}