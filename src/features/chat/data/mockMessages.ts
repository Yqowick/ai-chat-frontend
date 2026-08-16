import type { ChatMessage } from "@/features/chat/types/chat"

export const mockMessages: ChatMessage[] = [
  {
    id: "message-1",
    role: "assistant",
    content:
      "Hello! I'm your AI assistant. Ask me anything about your uploaded documents.",
    createdAt: "2026-08-16T08:00:00.000Z",
    status: "sent",
  },
  {
    id: "message-2",
    role: "user",
    content: "What can you help me with?",
    createdAt: "2026-08-16T08:01:00.000Z",
    status: "sent",
  },
  {
    id: "message-3",
    role: "assistant",
    content:
      "I can answer questions, summarize documents, and provide the sources used to generate each response.",
    createdAt: "2026-08-16T08:01:05.000Z",
    status: "sent",
    sources: [
      {
        title: "Project Knowledge Base",
      },
    ],
  },
]