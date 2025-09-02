import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Markdown } from "./markdown"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

export type MessageProps = {
  children: React.ReactNode
  className?: string
}

const Message = ({ children, className }: MessageProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {children}
    </div>
  )
}

export type MessageAvatarProps = {
  src: string
  alt: string
  fallback?: string
  delayMs?: number
  className?: string
}

const MessageAvatar = ({
  src,
  alt,
  fallback,
  delayMs,
  className,
}: MessageAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      <AvatarImage src={src} alt={alt} />
      {fallback && (
        <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>
      )}
    </Avatar>
  )
}

export type MessageContentProps = {
  children: React.ReactNode
  markdown?: boolean
  className?: string
} & React.ComponentProps<typeof Markdown> &
  React.HTMLProps<HTMLDivElement>

const MessageContent = ({
  children,
  markdown = false,
  className,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal",
    className
  )

  // Ensure children is a valid string for markdown
  const content = React.useMemo(() => {
    if (typeof children === 'string') {
      return children
    }
    if (children === null || children === undefined) {
      return ''
    }
    // Convert other types to string
    return String(children)
  }, [children])

  return markdown ? (
    // <Markdown className={classNames} {...props}>
    //   {/* {content} */}
    //   {content?.split("\n").map((line, index) => {
    //     return (
    //       <React.Fragment key={index}>
    //         {line}
    //         <br />
    //       </React.Fragment>
    //     )
    //   })}
    // </Markdown>
    content?.split("\n").map((line, index) => (
      <div key={index} className="leading-[2]">
        {line}
        <br />
      </div>
    ))
  ) : (
    <div className={classNames} {...props}>
      {children}
    </div>
  )
}

export type MessageActionsProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>

const MessageActions = ({
  children,
  className,
  ...props
}: MessageActionsProps) => (
  <div
    className={cn("text-muted-foreground flex items-center gap-2", className)}
    {...props}
  >
    {children}
  </div>
)

export type MessageActionProps = {
  className?: string
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
} & React.ComponentProps<typeof Tooltip>

const MessageAction = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: MessageActionProps) => {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Message, MessageAvatar, MessageContent, MessageActions, MessageAction }
