import { apiConfig } from "@/config/api"
import { mockMessages } from "@/features/chat/data/mockMessages"
import { sendMockMessage } from "@/features/chat/services/mockChatApi"
import {
  getRealConversation,
  sendRealMessage,
} from "@/features/chat/services/realChatApi"
import type { ConversationHistoryResponse } from "@/features/chat/types/chat"

export const sendMessage = apiConfig.useMockApi
  ? sendMockMessage
  : sendRealMessage

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