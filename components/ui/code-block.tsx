"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { highlightCode } from "@/lib/highlighter"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CodeBlockProps = React.ComponentProps<"div"> & {
  variant?: "default" | "destructive"
  size?: "default" | "sm"
}

function CodeBlock({
  className,
  variant = "default",
  size = "default",
  ...props
}: CodeBlockProps) {
  return (
    <div
      data-slot="code-block"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/code-block relative w-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] text-[var(--color-text)]",
        "data-[variant=destructive]:border-destructive/40 data-[variant=destructive]:bg-destructive/10",
        "[&>[data-slot=code-block-actions]]:absolute [&>[data-slot=code-block-actions]]:end-2 [&>[data-slot=code-block-actions]]:top-2",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-h-10 items-center justify-between gap-3 border-b border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-secondary)]",
        "group-data-[size=sm]/code-block:min-h-8 group-data-[size=sm]/code-block:px-2 group-data-[size=sm]/code-block:py-1.5",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "flex min-w-0 items-center gap-2 font-medium [&>span]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  )
}

type CodeBlockCopyButtonProps = Omit<React.ComponentProps<typeof Button>, "value"> & {
  value: string
}

type CodeBlockCopyButtonClickEvent = Parameters<
  NonNullable<React.ComponentProps<typeof Button>["onClick"]>
>[0]

function CodeBlockCopyButton({
  value,
  className,
  onClick,
  ...props
}: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  async function copyToClipboard(event: CodeBlockCopyButtonClickEvent) {
    onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={copied ? "Copied" : "Copy"}
        className={cn(
          "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text)]",
          className
        )}
        onClick={copyToClipboard}
        {...props}
      >
        {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </>
  )
}

type CodeBlockContentProps = React.ComponentProps<"pre"> & {
  wrap?: boolean
  lineNumbers?: boolean
  startLine?: number
  language?: string
}

function useHighlightedCode(code: string, language?: string) {
  const requestKey = `${language ?? ""}\u0000${code}`
  const plainLines = React.useMemo(
    () => code.replace(/\n$/, "").split("\n"),
    [code]
  )
  const [highlightedResult, setHighlightedResult] = React.useState<{
    key: string
    lines: React.ReactNode[] | null
  }>({ key: "", lines: null })

  React.useEffect(() => {
    let active = true

    if (!language) {
      return () => {
        active = false
      }
    }

    void highlightCode(code, language)
      .then((lines) => {
        if (active) {
          setHighlightedResult({ key: requestKey, lines })
        }
      })
      .catch(() => {
        if (active) {
          setHighlightedResult({ key: requestKey, lines: null })
        }
      })

    return () => {
      active = false
    }
  }, [code, language, requestKey])

  if (!language) {
    return null
  }

  return highlightedResult.key === requestKey
    ? highlightedResult.lines ?? plainLines
    : plainLines
}

function CodeBlockContent({
  children,
  className,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  language,
  tabIndex = 0,
  ...props
}: CodeBlockContentProps) {
  const code = typeof children === "string" ? children : ""
  const highlightedLines = useHighlightedCode(code, language)
  const lines = typeof children === "string" && (lineNumbers || language)
    ? highlightedLines ?? code.replace(/\n$/, "").split("\n")
    : null

  return (
    <pre
      data-slot="code-block-content"
      tabIndex={tabIndex}
      className={cn(
        "m-0 max-w-full overflow-auto p-4 font-mono text-sm leading-6 outline-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-text-secondary)]",
        "group-data-[size=sm]/code-block:p-3 group-data-[size=sm]/code-block:text-xs group-data-[size=sm]/code-block:leading-5",
        wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
        className
      )}
      {...props}
    >
      <code dir="ltr">
        {lines
          ? lines.map((line, index) => (
              <span
                className={cn(
                  "min-h-[1lh]",
                  lineNumbers ? "grid grid-cols-[auto_1fr]" : "block"
                )}
                key={index}
              >
                {lineNumbers ? (
                  <span
                    aria-hidden="true"
                    className="me-4 select-none text-end text-[color:var(--color-text-secondary)] opacity-60"
                  >
                    {startLine + index}
                  </span>
                ) : null}
                <span className="min-w-0">{line || "\n"}</span>
              </span>
            ))
          : children}
      </code>
    </pre>
  )
}

type CodeBlockLineProps = React.ComponentProps<"span"> & {
  variant?: "default" | "added" | "removed" | "highlighted"
}

function CodeBlockLine({
  className,
  variant = "default",
  ...props
}: CodeBlockLineProps) {
  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      className={cn(
        "block min-h-[1lh] px-4",
        "data-[variant=highlighted]:bg-accent",
        "data-[variant=added]:bg-green-500/10 data-[variant=added]:text-green-700 dark:data-[variant=added]:text-green-400",
        "data-[variant=removed]:bg-destructive/10 data-[variant=removed]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn(
        "flex items-center justify-between gap-3 border-t border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-secondary)]",
        className
      )}
      {...props}
    />
  )
}

export {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
}
