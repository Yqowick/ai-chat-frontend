import { useCallback, useEffect, useState } from "react"

import { apiConfig } from "@/config/api"
import { mockMessages } from "@/features/chat/data/mockMessages"
import {
  loadConversation,
  sendMessage as sendChatMessage,
} from "@/features/chat/services/chatApi"
import type { ChatMessage } from "@/features/chat/types/chat"

const conversationStorageKey = "ai-chat-conversation-id"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    apiConfig.useMockApi ? mockMessages : [],
  )

  const [conversationId, setConversationId] = useState<string | null>(
    () =>
      apiConfig.useMockApi
        ? null
        : localStorage.getItem(conversationStorageKey),
  )

  const [isResponding, setIsResponding] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
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
        const history = await loadConversation(conversationId!)

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

      if (!trimmedContent || isResponding) {
        return
      }

      const userMessageId = crypto.randomUUID()

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

      try {
        const response = await sendChatMessage({
          message: trimmedContent,
          conversationId: conversationId ?? undefined,
        })

        if (
          response.conversationId &&
          response.conversationId !== conversationId
        ) {
          localStorage.setItem(
            conversationStorageKey,
            response.conversationId,
          )

          setConversationId(response.conversationId)
        }

        setMessages((currentMessages) => [
          ...currentMessages.map((message) =>
            message.id === userMessageId
              ? { ...message, status: "sent" as const }
              : message,
          ),
          response.message,
        ])
      } catch (caughtError) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === userMessageId
              ? { ...message, status: "error" as const }
              : message,
          ),
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong while sending the message.",
        )
      } finally {
        setIsResponding(false)
      }
    },
    [conversationId, isResponding],
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