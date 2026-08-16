import { apiConfig } from "@/config/api"
import { sendMockMessage } from "@/features/chat/services/mockChatApi"
import { sendRealMessage } from "@/features/chat/services/realChatApi"

export const sendMessage = apiConfig.useMockApi
  ? sendMockMessage
  : sendRealMessage