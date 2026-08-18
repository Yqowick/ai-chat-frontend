import { apiConfig } from "@/config/api"
import { mockMessages } from "@/features/chat/data/mockMessages"
import { sendMockMessage } from "@/features/chat/services/mockChatApi"
import {
  getRealConversation,
  sendRealMessage,
  streamRealMessage,
} from "@/features/chat/services/realChatApi"
import type {
  ConversationHistoryResponse,
  SendMessageRequest,
  StreamMessageHandlers,
  StreamMessageResult,
} from "@/features/chat/types/chat"

export const sendMessage = apiConfig.useMockApi
  ? sendMockMessage
  : sendRealMessage

export async function streamMessage(
  request: SendMessageRequest,
  handlers: StreamMessageHandlers,
): Promise<StreamMessageResult> {
  if (apiConfig.useMockApi) {
    const response = await sendMockMessage(request)

    const conversationId =
      request.conversationId || "mock-conversation"

    handlers.onConversationId(conversationId)
    handlers.onChunk(response.message.content)

    return {
      conversationId,
    }
  }

  return streamRealMessage(request, handlers)
}

export async function loadConversation(
  conversationId: string,
): Promise<ConversationHistoryResponse> {
  if (apiConfig.useMockApi) {
    const now = new Date().toISOString()

    return {
      conversationId,
      title: "Mock conversation",
      messages: mockMessages,
      createdAt: now,
      updatedAt: now,
    }
  }

  return getRealConversation(conversationId)
}