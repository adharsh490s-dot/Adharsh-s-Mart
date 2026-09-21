"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Plus, X } from "lucide-react";
import { nanoid } from "nanoid";

import conciergeMark from "@/assets/concierge.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

type Session = { id: string; title: string; messages: UIMessage[] };

const SUGGESTIONS = [
  "Find me a premium laptop under ₹90,000",
  "Where is my latest order?",
  "Compare wireless earbuds for travel",
];

function ChatPanel({
  session,
  onMessages,
}: {
  session: Session;
  onMessages: (id: string, messages: UIMessage[]) => void;
}) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error, stop } = useChat({
    id: session.id,
    messages: session.messages,
    transport,
  });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    onMessages(session.id, messages);
  }, [messages, session.id, onMessages]);

  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  const send = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || busy) return;
      void sendMessage({ text: value });
    },
    [busy, sendMessage],
  );

  return (
    <>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-6 p-4">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<img src={conciergeMark} alt="" className="size-12" />}
              title="Your personal concierge"
              description="Ask about products, prices, orders or delivery — anytime."
            >
              <img src={conciergeMark} alt="" className="size-12" />
              <div className="space-y-1">
                <h3 className="font-display text-lg text-foreground">Your personal concierge</h3>
                <p className="text-xs text-muted-foreground">
                  Ask about products, prices, orders or delivery — anytime.
                </p>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-md border border-border/60 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <MessageResponse key={index}>{part.text}</MessageResponse>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && <Shimmer className="text-sm">Thinking...</Shimmer>}
          {error && (
            <p className="text-xs text-destructive">
              The concierge couldn't reply just now. Please try again in a moment.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 p-3">
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            send(message.text ?? "");
            event.currentTarget.reset();
          }}
        >
          <PromptInputTextarea ref={textareaRef} placeholder="Ask the concierge…" />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  );
}

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(() => [
    { id: nanoid(), title: "Conversation 1", messages: [] },
  ]);
  const [activeId, setActiveId] = useState(() => "");

  const active = sessions.find((s) => s.id === activeId) ?? sessions[0]!;

  const onMessages = useCallback((id: string, messages: UIMessage[]) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              messages,
              title:
                s.messages.length === 0 && messages.length > 0
                  ? firstText(messages[0]!) || s.title
                  : s.title,
            }
          : s,
      ),
    );
  }, []);

  const newSession = () => {
    const session = { id: nanoid(), title: `Conversation ${sessions.length + 1}`, messages: [] };
    setSessions((prev) => [...prev, session]);
    setActiveId(session.id);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close concierge" : "Open concierge"}
        className="fixed bottom-20 right-4 z-50 flex size-14 items-center justify-center rounded-full border border-primary/40 bg-ink/90 shadow-lg backdrop-blur transition-transform hover:scale-105 md:bottom-6 md:right-6"
      >
        {open ? (
          <X className="size-5 text-primary" />
        ) : (
          <MessageCircle className="size-5 text-primary" />
        )}
      </button>

      {open && (
        <div
          className={cn(
            "glass fixed bottom-36 right-4 z-50 flex h-[32rem] max-h-[75dvh] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-primary/20 shadow-2xl",
            "md:bottom-24 md:right-6",
          )}
        >
          <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <img src={conciergeMark} alt="" className="size-6" />
              <span className="editorial-kicker truncate text-xs">Concierge</span>
            </div>
            <div className="flex items-center gap-1">
              {sessions.length > 1 && (
                <select
                  value={active.id}
                  onChange={(e) => setActiveId(e.target.value)}
                  className="max-w-28 truncate rounded-md border border-border/60 bg-transparent px-2 py-1 text-xs text-muted-foreground"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              )}
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={newSession}
                aria-label="New conversation"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
          <ChatPanel key={active.id} session={active} onMessages={onMessages} />
        </div>
      )}
    </>
  );
}

function firstText(message: UIMessage) {
  const text = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join(" ")
    .trim();
  return text.length > 34 ? `${text.slice(0, 34)}…` : text;
}
