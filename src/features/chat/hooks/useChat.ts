import { useCallback, useEffect, useState } from "react"

import { apiConfig } from "@/config/api"
import { mockMessages } from "@/features/chat/data/mockMessages"
import {
  loadConversation,
  streamMessage as streamChatMessage,
} from "@/features/chat/services/chatApi"
import type { ChatMessage } from "@/features/chat/types/chat"

const conversationStorageKey = "ai-chat-conversation-id"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    apiConfig.useMockApi ? mockMessages : [],
  )

  const [conversationId, setConversationId] = useState<
    string | null
  >(() =>
    apiConfig.useMockApi
      ? null
      : localStorage.getItem(conversationStorageKey),
  )

  const [isResponding, setIsResponding] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] =
    useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (apiConfig.useMockApi || !conversationId) {
      return
    }

    let isCancelled = false

    async function restoreConversation() {
      setIsLoadingHistory(true)
      setError(null)

      try {
        const history = await loadConversation(
          conversationId!,
        )

        if (!isCancelled) {
          setMessages(history.messages)
        }
      } catch (caughtError) {
        if (!isCancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Failed to load the conversation history.",
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingHistory(false)
        }
      }
    }

    void restoreConversation()

    return () => {
      isCancelled = true
    }
  }, [conversationId])

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim()

      if (
        !trimmedContent ||
        isResponding ||
        isLoadingHistory
      ) {
        return
      }

      const userMessageId = crypto.randomUUID()
      const assistantMessageId = crypto.randomUUID()

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        status: "sending",
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        userMessage,
      ])

      setIsResponding(true)
      setError(null)

      let streamConversationId = conversationId

      try {
        const result = await streamChatMessage(
          {
            message: trimmedContent,
            conversationId: conversationId ?? undefined,
          },
          {
            onConversationId: (receivedConversationId) => {
              streamConversationId =
                receivedConversationId
            },

            onChunk: (text) => {
              setMessages((currentMessages) => {
                const assistantMessageExists =
                  currentMessages.some(
                    (message) =>
                      message.id === assistantMessageId,
                  )

                if (!assistantMessageExists) {
                  const assistantMessage: ChatMessage = {
                    id: assistantMessageId,
                    role: "assistant",
                    content: text,
                    createdAt: new Date().toISOString(),
                    status: "sending",
                  }

                  return [
                    ...currentMessages,
                    assistantMessage,
                  ]
                }

                return currentMessages.map((message) =>
                  message.id === assistantMessageId
                    ? {
                        ...message,
                        content: `${message.content}${text}`,
                      }
                    : message,
                )
              })
            },
          },
        )

        const finalConversationId =
          result.conversationId ||
          streamConversationId

        if (finalConversationId) {
          localStorage.setItem(
            conversationStorageKey,
            finalConversationId,
          )

          if (finalConversationId !== conversationId) {
            setConversationId(finalConversationId)
          }
        }

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === userMessageId ||
            message.id === assistantMessageId
              ? {
                  ...message,
                  status: "sent" as const,
                }
              : message,
          ),
        )
      } catch (caughtError) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === userMessageId ||
            message.id === assistantMessageId
              ? {
                  ...message,
                  status: "error" as const,
                }
              : message,
          ),
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong while streaming the response.",
        )
      } finally {
        setIsResponding(false)
      }
    },
    [
      conversationId,
      isLoadingHistory,
      isResponding,
    ],
  )

  const clearChat = useCallback(() => {
    localStorage.removeItem(conversationStorageKey)
    setConversationId(null)
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    conversationId,
    isResponding,
    isLoadingHistory,
    error,
    sendMessage,
    clearChat,
  }
}