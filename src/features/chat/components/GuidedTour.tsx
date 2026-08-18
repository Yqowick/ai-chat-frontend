import {
  useCallback,
  useEffect,
  useState,
} from "react"
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const guidedTourStorageKey =
  "ai-chat-guided-tour-completed"

interface TourStep {
  target: string
  title: string
  description: string
}

interface HighlightRectangle {
  top: number
  left: number
  width: number
  height: number
  bottom: number
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="header"]',
    title: "Welcome to the AI Assistant",
    description:
      "The assistant uses Gemini to generate streamed answers and keeps your conversations saved.",
  },
  {
    target:
      '[data-tour="conversation-sidebar"], [data-tour="header"]',
    title: "Conversation history",
    description:
      "Resume an old conversation or start a new one. Your messages remain available after refreshing the page.",
  },
  {
    target: '[data-tour="messages"]',
    title: "AI responses and citations",
    description:
      "Responses support Markdown, highlighted code, inline citations, response versions, feedback, and metadata.",
  },
  {
    target: '[data-tour="messages"]',
    title: "Response actions",
    description:
      "Regenerate an answer, switch between versions, submit feedback, and open response metadata.",
  },
  {
    target: '[data-tour="chat-input"]',
    title: "Ask your question",
    description:
      "Write your question here. Press Enter to send or Shift + Enter to create a new line.",
  },
]

function findVisibleTarget(
  selector: string,
) {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(
      selector,
    ),
  )

  return (
    elements.find((element) => {
      const rectangle =
        element.getBoundingClientRect()

      return (
        rectangle.width > 0 &&
        rectangle.height > 0
      )
    }) ?? null
  )
}

export function GuidedTour() {
  const [isOpen, setIsOpen] =
    useState(false)

  const [
    currentStepIndex,
    setCurrentStepIndex,
  ] = useState(0)

  const [
    highlightRectangle,
    setHighlightRectangle,
  ] =
    useState<HighlightRectangle | null>(
      null,
    )

  const currentStep =
    tourSteps[currentStepIndex]

  const updateHighlight =
    useCallback(() => {
      if (!isOpen || !currentStep) {
        setHighlightRectangle(null)
        return
      }

      const target = findVisibleTarget(
        currentStep.target,
      )

      if (!target) {
        setHighlightRectangle(null)
        return
      }

      const rectangle =
        target.getBoundingClientRect()

      const padding = 6

      setHighlightRectangle({
        top: Math.max(
          rectangle.top - padding,
          8,
        ),
        left: Math.max(
          rectangle.left - padding,
          8,
        ),
        width: Math.min(
          rectangle.width +
            padding * 2,
          window.innerWidth - 16,
        ),
        height:
          rectangle.height +
          padding * 2,
        bottom:
          rectangle.bottom +
          padding,
      })
    }, [currentStep, isOpen])

  useEffect(() => {
    const hasCompletedTour =
      localStorage.getItem(
        guidedTourStorageKey,
      ) === "true"

    if (hasCompletedTour) {
      return
    }

    const timer = window.setTimeout(
      () => {
        setCurrentStepIndex(0)
        setIsOpen(true)
      },
      700,
    )

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const target = findVisibleTarget(
      currentStep.target,
    )

    target?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    })

    const timer = window.setTimeout(
      updateHighlight,
      250,
    )

    window.addEventListener(
      "resize",
      updateHighlight,
    )

    window.addEventListener(
      "scroll",
      updateHighlight,
      true,
    )

    return () => {
      window.clearTimeout(timer)

      window.removeEventListener(
        "resize",
        updateHighlight,
      )

      window.removeEventListener(
        "scroll",
        updateHighlight,
        true,
      )
    }
  }, [
    currentStep,
    isOpen,
    updateHighlight,
  ])

  function closeTour() {
    localStorage.setItem(
      guidedTourStorageKey,
      "true",
    )

    setIsOpen(false)
    setHighlightRectangle(null)
  }

  function restartTour() {
    setCurrentStepIndex(0)
    setIsOpen(true)
  }

  function showPreviousStep() {
    setCurrentStepIndex(
      (currentIndex) =>
        Math.max(
          currentIndex - 1,
          0,
        ),
    )
  }

  function showNextStep() {
    if (
      currentStepIndex ===
      tourSteps.length - 1
    ) {
      closeTour()
      return
    }

    setCurrentStepIndex(
      (currentIndex) =>
        currentIndex + 1,
    )
  }

  const tooltipWidth = Math.min(
    360,
    window.innerWidth - 32,
  )

  const tooltipLeft =
    highlightRectangle
      ? Math.min(
          Math.max(
            highlightRectangle.left,
            16,
          ),
          window.innerWidth -
            tooltipWidth -
            16,
        )
      : 16

  const availableSpaceBelow =
    highlightRectangle
      ? window.innerHeight -
        highlightRectangle.bottom
      : 0

  const tooltipTop =
    highlightRectangle
      ? availableSpaceBelow > 245
        ? highlightRectangle.bottom + 14
        : Math.max(
            highlightRectangle.top -
              225,
            16,
          )
      : 100

  return (
    <>
      {!isOpen && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="fixed bottom-24 right-5 z-30 gap-2 rounded-full bg-background shadow-lg"
          onClick={restartTour}
          aria-label="Start guided tour"
          title="Start guided tour"
        >
          <CircleHelp className="size-4" />
          Tour
        </Button>
      )}

      {isOpen && (
        <>
          {highlightRectangle && (
            <div
              aria-hidden="true"
              className="pointer-events-none fixed z-[80] rounded-xl border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.58)] transition-all duration-300"
              style={{
                top: highlightRectangle.top,
                left: highlightRectangle.left,
                width:
                  highlightRectangle.width,
                height:
                  highlightRectangle.height,
              }}
            />
          )}

          <section
            role="dialog"
            aria-modal="true"
            aria-label="Application guided tour"
            className="fixed z-[90] rounded-xl border bg-popover p-4 text-popover-foreground shadow-2xl"
            style={{
              top: tooltipTop,
              left: tooltipLeft,
              width: tooltipWidth,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Step{" "}
                  {currentStepIndex + 1} of{" "}
                  {tourSteps.length}
                </p>

                <h2 className="mt-1 font-semibold">
                  {currentStep.title}
                </h2>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={closeTour}
                aria-label="Close guided tour"
                title="Skip tour"
              >
                <X className="size-4" />
              </Button>
            </div>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {currentStep.description}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {tourSteps.map(
                  (_, stepIndex) => (
                    <span
                      key={stepIndex}
                      className={
                        stepIndex ===
                        currentStepIndex
                          ? "size-2 rounded-full bg-blue-600"
                          : "size-2 rounded-full bg-muted"
                      }
                    />
                  ),
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={
                      showPreviousStep
                    }
                  >
                    <ArrowLeft className="size-3.5" />
                    Back
                  </Button>
                )}

                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5"
                  onClick={showNextStep}
                >
                  {currentStepIndex ===
                  tourSteps.length - 1
                    ? "Finish"
                    : "Next"}

                  {currentStepIndex !==
                    tourSteps.length -
                      1 && (
                    <ArrowRight className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}