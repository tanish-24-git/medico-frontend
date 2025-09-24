"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Bot, User, Loader2, Heart, Brain, Stethoscope, Upload, Zap } from "lucide-react"
import { api, type ChatMessage, type QuestionResponse } from "@/lib/api"
import { ReportUpload } from "./report-upload"
import { TermSimplifier } from "./term-simplifier"
import { RealTimeChat } from "./real-time-chat"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm SHIVAAI, your medical AI assistant. I can help you with medical questions, analyze reports, and simplify medical terms. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: "typing",
      type: "assistant",
      content: "Analyzing your question...",
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    try {
      const response: QuestionResponse = await api.askQuestion(userMessage.content)

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"))

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.llm_answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Add retrieved documents if available
      if (response.retrieved_docs && response.retrieved_docs.length > 0) {
        const docsMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: "system",
          content: `Related medical information found:\n\n${response.retrieved_docs
            .map((doc) => `**${doc.disease}**: ${doc.info.substring(0, 200)}...`)
            .join("\n\n")}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, docsMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"))

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I apologize, but I'm having trouble connecting to my medical database right now. Please try again in a moment, or contact your healthcare provider for urgent medical concerns.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />")
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      {/* Header */}
      <Card className="mb-4 border-medical-blue/20 bg-gradient-to-r from-medical-blue/5 to-medical-purple/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-medical-blue">
            <div className="p-2 rounded-full bg-medical-blue/10">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SHIVAAI Medical Assistant</h1>
              <p className="text-sm text-muted-foreground font-normal">
                AI-powered healthcare consultation and medical analysis
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Chat Assistant
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Real-Time Chat
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Report Analysis
          </TabsTrigger>
          <TabsTrigger value="simplify" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Term Simplifier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          {/* Quick Actions */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-medical-blue/10 transition-colors"
              onClick={() => setInput("What are the symptoms of diabetes?")}
            >
              <Heart className="h-3 w-3 mr-1" />
              Common Symptoms
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-medical-green/10 transition-colors"
              onClick={() => setInput("Explain hypertension in simple terms")}
            >
              <Brain className="h-3 w-3 mr-1" />
              Simplify Terms
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-medical-purple/10 transition-colors"
              onClick={() => setInput("What should I do for a fever?")}
            >
              <Stethoscope className="h-3 w-3 mr-1" />
              First Aid
            </Badge>
          </div>

          {/* Chat Messages */}
          <Card className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
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
                          ? "bg-medical-blue text-white ml-auto"
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
                        <AvatarFallback className="bg-medical-blue/10 text-medical-blue">
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
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about symptoms, treatments, or medical terms..."
                  disabled={isLoading}
                  className="flex-1 focus:ring-medical-blue/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-medical-blue hover:bg-medical-blue/90 text-white"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                SHIVAAI provides general medical information. Always consult healthcare professionals for medical
                advice.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="flex-1 mt-0">
          <RealTimeChat />
        </TabsContent>

        <TabsContent value="upload" className="flex-1 mt-0">
          <ReportUpload />
        </TabsContent>

        <TabsContent value="simplify" className="flex-1 mt-0">
          <TermSimplifier />
        </TabsContent>
      </Tabs>
    </div>
  )
}
