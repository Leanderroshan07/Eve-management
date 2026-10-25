"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  User,
  CheckCheck,
  FileSignature,
  ShieldAlert,
  Search,
} from "lucide-react";
import { OrganizerHeader } from "@/components/organizer/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEEDED_MESSAGES, ChatMessage } from "@/lib/organizer-data";

export default function OrganizerMessagesPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(SEEDED_MESSAGES);
  const [inputVal, setInputVal] = React.useState("");

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: "conv-101",
      sender_type: "organizer",
      sender_name: "VKS Concierge",
      text: inputVal.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setInputVal("");
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <OrganizerHeader
        title="Client Communication & Messages"
        description="Direct real-time communication with event clients. Messages do not unilaterally alter proposals."
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Conversation List */}
        <div className="w-80 border-r border-amber-500/20 bg-[#160803]/85 backdrop-blur-xl flex flex-col shrink-0">
          <div className="p-3 border-b border-amber-500/15">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-amber-400/80 z-10" />
              <Input
                placeholder="Search conversations..."
                className="pl-8 h-9 text-xs glass-field placeholder:text-amber-200/40 text-foreground"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-amber-500/10">
            <div className="p-3.5 bg-[#240e05]/85 border-l-2 border-amber-500 cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">
                  Vikram & Ananya Sundaram
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">16:15</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-1">
                Proposal v1 reflecting ivory & burgundy floral customization...
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="champagne" className="text-[9px] py-0 px-1.5 h-4">
                  Grand Wedding
                </Badge>
              </div>
            </div>

            <div className="p-3.5 hover:bg-muted/40 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-xs">
                  Pooja & Rohan Mehra
                </span>
                <span className="text-[10px] text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-1">
                Looking forward to discussing LED wall options for Sangeet.
              </p>
            </div>

            <div className="p-3.5 hover:bg-muted/40 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-xs">
                  Aditya & Sneha Rao
                </span>
                <span className="text-[10px] text-muted-foreground">20 Oct</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-1">
                Thank you! Advance token paid under Agreed Proposal v2.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Active Chat Conversation */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                VS
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">
                  Vikram & Ananya Sundaram
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  Event: Grand Wedding & Sangeet (28 Nov 2026)
                </span>
              </div>
            </div>

            <Link href="/organizer/proposals?inquiryId=inq-101">
              <Button variant="outline" size="sm" className="h-7 text-xs border-border text-foreground hover:bg-muted gap-1.5">
                <FileSignature className="h-3 w-3 text-amber-500" /> View Proposal v1
              </Button>
            </Link>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {/* Legal Notice */}
            <div className="text-center py-2">
              <span className="text-[10px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border">
                Messages are communication records. Contractual terms are governed by mutually accepted proposals.
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender_type === "organizer";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? "bg-amber-500/15 border border-amber-500/30 text-foreground rounded-tr-none"
                        : "bg-muted/70 border border-border text-foreground rounded-tl-none"
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block mb-1">
                      {msg.sender_name}
                    </span>
                    <p>{msg.text}</p>
                    {msg.proposal_id && (
                      <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-300">
                        <span>Attached Proposal: PROP-2026-089-V1</span>
                        <Link href="/organizer/proposals" className="underline font-semibold hover:text-amber-500">
                          Open
                        </Link>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {isMe && <CheckCheck className="h-3 w-3 text-amber-500" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <div className="p-3 border-t border-amber-500/20 bg-[#1c0c05]/90 backdrop-blur-xl flex gap-2">
            <Input
              placeholder="Type message to client... (Press Enter to send)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="glass-field text-foreground placeholder:text-amber-200/40 text-xs h-10"
            />
            <Button variant="champagne" size="sm" onClick={handleSend} className="h-10 px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
