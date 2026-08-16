import type {
  SendMessageRequest,
  SendMessageResponse,
} from "@/features/chat/types/chat"

const MOCK_RESPONSE_DELAY = 700

function delay(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

export async function sendMockMessage(
  request: SendMessageRequest,
): Promise<SendMessageResponse> {
  await delay(MOCK_RESPONSE_DELAY)

  return {
    message: {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `This is a mock AI response to: "${request.message}"`,
      createdAt: new Date().toISOString(),
      status: "sent",
      sources: [
        {
          title: "Mock Knowledge Base",
        },
      ],
    },
  }
}