import { apiConfig } from "@/config/api"
import type {
  SendMessageRequest,
  SendMessageResponse,
} from "@/features/chat/types/chat"

export async function sendRealMessage(
  request: SendMessageRequest,
): Promise<SendMessageResponse> {
  const response = await fetch(`${apiConfig.baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error("Failed to send the message.")
  }

  return response.json() as Promise<SendMessageResponse>
}