export type ChatRole = "user" | "assistant"

export type MessageStatus = "sending" | "sent" | "error"

export interface ChatSource {
  title: string
  url?: string
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  status: MessageStatus
  sources?: ChatSource[]
}

export interface SendMessageRequest {
  message: string
}

export interface SendMessageResponse {
  message: ChatMessage
}