import { useState } from "react"
import { AlertCircle } from "lucide-react"

import { ChatHeader } from "@/components/layout/ChatHeader"
import { ChatInput } from "@/features/chat/components/ChatInput"
import { ConversationSidebar } from "@/features/chat/components/ConversationSidebar"
import { GuidedTour } from "@/features/chat/components/GuidedTour"
import { MessageList } from "@/features/chat/components/MessageList"
import { useChat } from "@/features/chat/hooks/useChat"

export function ChatPage() {
  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false)

  const {
    messages,
    conversationId,
    conversations,
    isResponding,
    isLoadingHistory,
    isLoadingConversations,
    isPerformingMessageAction,
    activeMessageActionId,
    messageActionType,
    error,
    sendMessage,
    regenerateMessage,
    switchMessageVersion,
    selectConversation,
    startNewConversation,
  } = useChat()

  const isAssistantStreaming =
    messages.at(-1)?.role ===
      "assistant" &&
    messages.at(-1)?.status ===
      "sending"

  const isInterfaceBusy =
    isResponding ||
    isLoadingHistory ||
    isPerformingMessageAction

  const shouldShowThinkingIndicator =
    (isResponding ||
      isLoadingHistory) &&
    !isAssistantStreaming

  function handleNewConversation() {
    startNewConversation()
    setIsSidebarOpen(false)
  }

  function handleSelectConversation(
    selectedConversationId: string,
  ) {
    selectConversation(
      selectedConversationId,
    )

    setIsSidebarOpen(false)
  }

  return (
    <div className="flex h-svh overflow-hidden bg-muted/30">
      <aside
        data-tour="conversation-sidebar"
        className="hidden w-72 shrink-0 border-r md:block"
      >
        <ConversationSidebar
          conversations={
            conversations
          }
          activeConversationId={
            conversationId
          }
          isLoading={
            isLoadingConversations
          }
          isBusy={
            isInterfaceBusy
          }
          onNewConversation={
            handleNewConversation
          }
          onSelectConversation={
            handleSelectConversation
          }
        />
      </aside>

      {isSidebarOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/45 md:hidden"
            onClick={() =>
              setIsSidebarOpen(false)
            }
            aria-label="Close conversations"
          />

          <aside className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-72 border-r bg-background shadow-xl md:hidden">
            <ConversationSidebar
              conversations={
                conversations
              }
              activeConversationId={
                conversationId
              }
              isLoading={
                isLoadingConversations
              }
              isBusy={
                isInterfaceBusy
              }
              onNewConversation={
                handleNewConversation
              }
              onSelectConversation={
                handleSelectConversation
              }
              onClose={() =>
                setIsSidebarOpen(false)
              }
            />
          </aside>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div data-tour="header">
          <ChatHeader
            isBusy={
              isInterfaceBusy
            }
            onNewConversation={
              handleNewConversation
            }
            onToggleSidebar={() =>
              setIsSidebarOpen(true)
            }
          />
        </div>

        <main
          data-tour="messages"
          className="min-h-0 flex-1"
        >
          <MessageList
            messages={messages}
            conversationId={
              conversationId
            }
            isResponding={
              shouldShowThinkingIndicator
            }
            activeMessageActionId={
              activeMessageActionId
            }
            messageActionType={
              messageActionType
            }
            onRegenerateMessage={
              regenerateMessage
            }
            onSwitchMessageVersion={
              switchMessageVersion
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

        <div data-tour="chat-input">
          <ChatInput
            isResponding={
              isInterfaceBusy
            }
            onSendMessage={
              sendMessage
            }
          />
        </div>
      </div>

      <GuidedTour />
    </div>
  )
}