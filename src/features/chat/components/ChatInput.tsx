import { useState } from "react"
import type {
  FormEvent,
  KeyboardEvent,
} from "react"
import {
  LoaderCircle,
  SendHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  isResponding: boolean
  onSendMessage: (message: string) => void
}

export function ChatInput({
  isResponding,
  onSendMessage,
}: ChatInputProps) {
  const [message, setMessage] = useState("")

  const canSend =
    message.trim().length > 0 && !isResponding

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || isResponding) {
      return
    }

    onSendMessage(trimmedMessage)
    setMessage("")
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl"
      >
        <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/50">
          <Textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={isResponding}
            placeholder="Ask a question about your documents..."
            aria-label="Chat message"
            rows={1}
            className="max-h-40 min-h-11 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            aria-label="Send message"
            className="mb-0.5 shrink-0 rounded-xl"
          >
            {isResponding ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <SendHorizontal className="size-5" />
            )}
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  )
}