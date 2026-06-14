"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Sorry, I couldn't process that. Please try again. 😅" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error. Please check your internet and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-200"
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl shadow-primary/10 bg-background/95 backdrop-blur-xl h-[520px]">
          {/* Header */}
          <header className="flex items-center gap-3 border-b bg-gradient-to-r from-primary/10 via-background to-primary/5 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">LearnPathX Assistant</h3>
              <p className="text-[11px] text-muted-foreground">Powered by Gemini AI</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 hover:bg-muted transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-80">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Hi! I'm your learning assistant 👋</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                    Ask me anything about your roadmaps, topics, or get personalized learning tips!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {["What should I learn next?", "Tips for my streak", "Explain my progress"].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <footer className="border-t p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-center gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 rounded-full border-border/50 bg-muted/50 px-4 text-sm h-10"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="h-10 w-10 rounded-full shrink-0"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </footer>
        </Card>
      )}
    </>
  );
}
