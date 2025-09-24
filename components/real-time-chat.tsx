"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Bot, User, Loader2, Wifi, WifiOff, RefreshCw, Zap, AlertCircle, CheckCircle } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"
import type { ChatMessage } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const WS_URL = API_BASE_URL.replace("http", "ws") + "/ws/disease_info"

export function RealTimeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content: "Real-time connection established! Ask me any medical question and get instant responses.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { isConnected, isConnecting, error, connect, disconnect, sendMessage } = useWebSocket(WS_URL, {
    onMessage: (data) => {
      setIsWaitingForResponse(false)

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"))

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.llm_answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Add retrieved documents if available
      if (data.retrieved_docs && data.retrieved_docs.length > 0) {
        const docsMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: "system",
          content: `Related medical information found:\n\n${data.retrieved_docs
            .map((doc: any) => `**${doc.disease}**: ${doc.info.substring(0, 200)}...`)
            .join("\n\n")}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, docsMessage])
      }
    },
    onError: (error) => {
      console.error("WebSocket error:", error)
      setIsWaitingForResponse(false)
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"))
    },
    onOpen: () => {
      console.log("WebSocket connected")
    },
    onClose: () => {
      console.log("WebSocket disconnected")
      setIsWaitingForResponse(false)
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"))
    },
  })

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim() || !isConnected || isWaitingForResponse) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Send message via WebSocket
    const success = sendMessage(input.trim())

    if (success) {
      setInput("")
      setIsWaitingForResponse(true)

      // Add typing indicator
      const typingMessage: ChatMessage = {
        id: "typing",
        type: "assistant",
        content: "Processing your question in real-time...",
        timestamp: new Date(),
        isTyping: true,
      }
      setMessages((prev) => [...prev, typingMessage])
    } else {
      // Remove the user message if sending failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />")
  }

  const getConnectionStatus = () => {
    if (isConnecting) {
      return { icon: RefreshCw, text: "Connecting...", color: "text-yellow-500", bgColor: "bg-yellow-500/10" }
    }
    if (isConnected) {
      return { icon: Wifi, text: "Connected", color: "text-medical-green", bgColor: "bg-medical-green/10" }
    }
    return { icon: WifiOff, text: "Disconnected", color: "text-destructive", bgColor: "bg-destructive/10" }
  }

  const status = getConnectionStatus()
  const StatusIcon = status.icon

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="border-medical-purple/20 bg-medical-purple/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${status.bgColor}`}>
                <Zap className="h-5 w-5 text-medical-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-medical-purple">Real-Time Medical Chat</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusIcon className={`h-4 w-4 ${status.color} ${isConnecting ? "animate-spin" : ""}`} />
                  <span className={`text-sm ${status.color}`}>{status.text}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {!isConnected && !isConnecting && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={connect}
                  className="text-medical-purple border-medical-purple/30 hover:bg-medical-purple/10 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reconnect
                </Button>
              )}
              {isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="text-muted-foreground hover:text-destructive bg-transparent"
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}. Please check your connection and try again.</AlertDescription>
        </Alert>
      )}

      {/* Chat Interface */}
      <Card className="flex flex-col h-[500px]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-medical-blue" />
            Real-Time Medical Assistant
            {isConnected && (
              <Badge variant="secondary" className="bg-medical-green/10 text-medical-green">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-slide-up ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type !== "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback
                      className={`
                      ${message.type === "assistant" ? "bg-medical-blue/10 text-medical-blue" : "bg-medical-gray/10 text-muted-foreground"}
                    `}
                    >
                      {message.type === "assistant" ? <Bot className="h-4 w-4" /> : "S"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`
                  max-w-[80%] rounded-lg px-4 py-3 text-sm
                  ${
                    message.type === "user"
                      ? "bg-medical-purple text-white ml-auto"
                      : message.type === "system"
                        ? "bg-medical-gray/20 text-foreground border border-border"
                        : "bg-card text-card-foreground border border-border"
                  }
                  ${message.isTyping ? "animate-pulse-medical" : ""}
                `}
                >
                  {message.isTyping ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {message.content}
                    </div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(message.content),
                      }}
                    />
                  )}
                  <div
                    className={`
                    text-xs mt-2 opacity-70
                    ${message.type === "user" ? "text-white/70" : "text-muted-foreground"}
                  `}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {message.type === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-medical-purple/10 text-medical-purple">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isConnected ? "Ask a medical question for instant response..." : "Connect to start chatting..."
              }
              disabled={!isConnected || isWaitingForResponse}
              className="flex-1 focus:ring-medical-purple/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || !isConnected || isWaitingForResponse}
              className="bg-medical-purple hover:bg-medical-purple/90 text-white"
            >
              {isWaitingForResponse ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Real-time responses powered by WebSocket connection
          </p>
        </div>
      </Card>
    </div>
  )
}
