"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Paperclip,
  CheckCheck,
  FileSignature,
  ShieldAlert,
  ArrowRight,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEEDED_MESSAGES, ChatMessage } from "@/lib/organizer-data";
import { CURRENT_CUSTOMER } from "@/lib/customer-data";

export default function CustomerMessagesPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState("");

  React.useEffect(() => {
    setMessages([...SEEDED_MESSAGES]);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: "conv-101",
      sender_type: "customer",
      sender_name: CURRENT_CUSTOMER.name.split("&")[0].trim(),
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    SEEDED_MESSAGES.push(msg);
    setMessages([...SEEDED_MESSAGES]);
    setNewMessage("");

    // Simulate organizer auto-response after 1.5s
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        conversation_id: "conv-101",
        sender_type: "organizer",
        sender_name: "VKS Concierge",
        text: "Namaste Vikram! We have received your update. If you need any itemized scope additions or steward adjustments, we will incorporate them into your next proposal revision.",
        timestamp: new Date().toISOString(),
      };
      SEEDED_MESSAGES.push(reply);
      setMessages([...SEEDED_MESSAGES]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Organizer Concierge Messages
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Direct communication with your VKS event directors and scenography planning crew.
          </p>
        </div>

        {/* Contractual Notice */}
        <div className="flex items-center gap-2 text-xs text-amber-200/70 bg-[#240e05]/70 px-3.5 py-2 rounded-xl border border-amber-500/25 max-w-md shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] leading-relaxed">
            Chat messages are communication records. Contractual terms are only modified via versioned proposals.
          </span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <Card className="border border-amber-500/20 bg-[#1c0c05]/80 backdrop-blur-xl overflow-hidden shadow-lg flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-amber-500/20 bg-[#240e05]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">VKS Concierge & Event Directors</span>
                <Badge variant="success" className="text-[9px] px-1.5 py-0">Online</Badge>
              </div>
              <span className="text-xs text-amber-200/70">
                Assigned: Grand Wedding & Sangeet at Leela Palace, Chennai
              </span>
            </div>
          </div>

          <Link href="/customer/proposals">
            <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/15 text-xs gap-1.5">
              <FileSignature className="w-3.5 h-3.5" />
              <span>View Active Proposal</span>
            </Button>
          </Link>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender_type === "customer";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 text-[11px] text-amber-200/60 mb-1 px-1">
                  <span className="font-semibold text-foreground/80">{msg.sender_name}</span>
                  <span>•</span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div
                  className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-br-none shadow-md"
                      : "bg-[#240e05]/85 border border-amber-500/25 text-foreground rounded-bl-none shadow-xs"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Proposal Attachment Link if present */}
                  {msg.proposal_id && (
                    <div className="mt-2.5 pt-2 border-t border-amber-500/25 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        <FileSignature className="w-3.5 h-3.5" />
                        <span>Proposal Attachment</span>
                      </div>
                      <Link
                        href="/customer/proposals"
                        className="underline text-[11px] font-bold hover:opacity-80 flex items-center gap-0.5"
                      >
                        <span>Open Proposal</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Composer */}
        <div className="p-4 border-t border-amber-500/20 bg-[#1c0c05]/90">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message or ritual questions for the VKS team..."
              className="glass-field text-foreground text-xs placeholder:text-amber-200/40"
            />
            <Button
              type="submit"
              variant="champagne"
              className="px-4 shrink-0 gap-1.5 text-xs font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
