import {
  isValidElement,
  useState,
} from "react"
import type {
  ComponentPropsWithoutRef,
  ReactNode,
} from "react"
import {
  AlertCircle,
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  LoaderCircle,
  RefreshCw,
  User,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import "@/features/chat/styles/markdown.css"
import type { ChatMessage } from "@/features/chat/types/chat"
import { cn } from "@/lib/utils"

type MessageActionType =
  | "regenerate"
  | "switch-version"
  | null

interface MessageBubbleProps {
  message: ChatMessage
  isActionLoading: boolean
  messageActionType: MessageActionType
  onRegenerate: (messageId: string) => void
  onSwitchVersion: (
    messageId: string,
    versionIndex: number,
  ) => void
}

function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
}

function extractText(node: ReactNode): string {
  if (
    typeof node === "string" ||
    typeof node === "number"
  ) {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("")
  }

  if (
    isValidElement<{
      children?: ReactNode
    }>(node)
  ) {
    return extractText(node.props.children)
  }

  return ""
}

function MarkdownCodeBlock({
  children,
}: ComponentPropsWithoutRef<"pre">) {
  const [isCopied, setIsCopied] = useState(false)

  const codeText = extractText(children).replace(/\n$/, "")

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(codeText)
      setIsCopied(true)

      window.setTimeout(() => {
        setIsCopied(false)
      }, 1800)
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <div className="markdown-code-block">
      <button
        type="button"
        className="markdown-copy-button"
        onClick={copyCode}
        aria-label="Copy code to clipboard"
        title="Copy code"
      >
        {isCopied ? (
          <>
            <Check className="size-3.5" />
            Copied
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            Copy
          </>
        )}
      </button>

      <pre>{children}</pre>
    </div>
  )
}

function AssistantMarkdown({
  content,
}: {
  content: string
}) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [
            rehypeHighlight,
            {
              detect: true,
            },
          ],
        ]}
        components={{
          pre: MarkdownCodeBlock,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function MessageBubble({
  message,
  isActionLoading,
  messageActionType,
  onRegenerate,
  onSwitchVersion,
}: MessageBubbleProps) {
  const isUserMessage = message.role === "user"

  const versions = message.versions ?? []

  const activeVersionIndex =
    message.activeVersionIndex ?? 0

  const hasMultipleVersions = versions.length > 1

  const canShowActions =
    !isUserMessage && message.status === "sent"

  const canSelectPreviousVersion =
    hasMultipleVersions &&
    activeVersionIndex > 0 &&
    !isActionLoading

  const canSelectNextVersion =
    hasMultipleVersions &&
    activeVersionIndex < versions.length - 1 &&
    !isActionLoading

  return (
    <article
      className={cn(
        "flex w-full items-start gap-3",
        isUserMessage && "flex-row-reverse",
      )}
    >
      <Avatar className="size-9 shrink-0">
        <AvatarFallback
          className={cn(
            isUserMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isUserMessage ? (
            <User className="size-4" />
          ) : (
            <Bot className="size-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "min-w-0",
          isUserMessage
            ? "max-w-[80%] sm:max-w-[70%]"
            : "max-w-[88%] sm:max-w-[82%]",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUserMessage
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm border bg-card text-card-foreground",
          )}
        >
          {isUserMessage ? (
            <p className="whitespace-pre-wrap leading-6">
              {message.content}
            </p>
          ) : (
            <AssistantMarkdown content={message.content} />
          )}

          {message.sources && message.sources.length > 0 && (
            <div className="mt-3">
              <Separator className="mb-3" />

              <p className="mb-2 text-xs font-medium">
                Sources
              </p>

              <ul className="space-y-1">
                {message.sources.map((source, index) => (
                  <li
                    key={`${source.title}-${index}`}
                    className="text-xs opacity-80"
                    title={source.url ?? source.title}
                  >
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {canShowActions && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
              disabled={isActionLoading}
              onClick={() => onRegenerate(message.id)}
              aria-label="Regenerate response"
              title="Regenerate response"
            >
              {isActionLoading &&
              messageActionType === "regenerate" ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}

              {isActionLoading &&
              messageActionType === "regenerate"
                ? "Regenerating..."
                : "Regenerate"}
            </Button>

            {hasMultipleVersions && (
              <div className="ml-1 flex items-center gap-0.5 rounded-md border bg-background p-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  disabled={!canSelectPreviousVersion}
                  onClick={() =>
                    onSwitchVersion(
                      message.id,
                      activeVersionIndex - 1,
                    )
                  }
                  aria-label="Previous response version"
                  title="Previous response version"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>

                <span className="min-w-10 text-center text-[11px] text-muted-foreground">
                  {activeVersionIndex + 1} /{" "}
                  {versions.length}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  disabled={!canSelectNextVersion}
                  onClick={() =>
                    onSwitchVersion(
                      message.id,
                      activeVersionIndex + 1,
                    )
                  }
                  aria-label="Next response version"
                  title="Next response version"
                >
                  {isActionLoading &&
                  messageActionType ===
                    "switch-version" ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            "mt-1.5 flex items-center gap-1.5 px-1 text-xs text-muted-foreground",
            isUserMessage && "justify-end",
          )}
        >
          <time dateTime={message.createdAt}>
            {formatMessageTime(message.createdAt)}
          </time>

          {message.status === "sending" && (
            <LoaderCircle className="size-3 animate-spin" />
          )}

          {message.status === "error" && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertCircle className="size-3" />
              Failed
            </span>
          )}
        </div>
      </div>
    </article>
  )
}