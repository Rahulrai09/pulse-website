"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Minus, Maximize2, X, Send, Mic, CheckCircle2 } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  isThinking?: boolean;
};

type UserData = {
  name: string;
  specialty: string;
  hospital: string;
  mobile: string;
  email: string;
  requirement: string;
};

export default function PulseChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<number>(0);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    specialty: "",
    hospital: "",
    mobile: "",
    email: "",
    requirement: "",
  });

  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("pulse_chat_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.messages?.length) {
          setMessages(parsed.messages);
          setStep(parsed.step ?? 0);
          setUserData(parsed.userData ?? userData);
          return;
        }
      } catch (e) {
        console.error("Error parsing chat state", e);
      }
    }
    // Initialize
    initChat();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "pulse_chat_state",
        JSON.stringify({ messages, step, userData })
      );
    }
    scrollToBottom();
  }, [messages, step, userData]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getTimestamp = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, sender: "bot", timestamp: getTimestamp() },
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, sender: "user", timestamp: getTimestamp() },
    ]);
  };

  const initChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hi! Welcome to Pulse. We deliver integrated medical equipment across 9 specialties. What brings you here today?",
        sender: "bot",
        timestamp: getTimestamp(),
      },
    ]);
    setStep(0);
    setUserData({ name: "", specialty: "", hospital: "", mobile: "", email: "", requirement: "" });
  };

  const resetChat = () => {
    localStorage.removeItem("pulse_chat_state");
    initChat();
  };

  const simulateThinking = (callback: () => void) => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      callback();
    }, 1200);
  };

  const handleAction = (text: string) => {
    addUserMessage(text);
    simulateThinking(() => {
      if (step === 0) {
        setStep(1);
        addBotMessage("Great! Which specialty area are you looking for?");
      } else if (step === 1) {
        setUserData((prev) => ({ ...prev, specialty: text }));
        setStep(2);
        addBotMessage("May I know your name, please?");
      } else if (step === 7) {
        if (text === "Browse Catalog") {
          setIsOpen(false);
          const el = document.getElementById("categories");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (text === "Continue on WhatsApp") {
          window.open("https://wa.me/919071101108", "_blank");
        }
      }
    });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue("");
    addUserMessage(text);

    simulateThinking(() => {
      if (step === 2) {
        setUserData((prev) => ({ ...prev, name: text }));
        setStep(3);
        addBotMessage(`Hi ${text}! Let's get a few details so our team can assist you better. What is your Hospital/Company name?`);
      } else if (step === 3) {
        setUserData((prev) => ({ ...prev, hospital: text }));
        setStep(4);
        addBotMessage("Got it. Please enter your Mobile Number.");
      } else if (step === 4) {
        setUserData((prev) => ({ ...prev, mobile: text }));
        setStep(5);
        addBotMessage("And your Email Address?");
      } else if (step === 5) {
        setUserData((prev) => ({ ...prev, email: text }));
        setStep(6);
        addBotMessage("Almost done! Please provide a brief requirement (or click Skip).");
      } else if (step === 6) {
        setUserData((prev) => ({ ...prev, requirement: text }));
        setStep(7);
        addBotMessage(`Thanks ${userData.name || "there"}! Our team will reach out within 24 hours.`);
      } else {
        // Fallback or general chat after completion
        addBotMessage("Thank you for reaching out! Our team will contact you shortly.");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
    if (e.key === "Escape") {
      if (isOpen && !showConfirmClose) handleClose();
    }
  };

  const handleClose = () => {
    setShowConfirmClose(true);
  };

  const confirmClose = (confirm: boolean) => {
    setShowConfirmClose(false);
    if (confirm) {
      setIsOpen(false);
      resetChat();
      setIsFullscreen(false);
    }
  };

  // Quick replies mapping
  const quickRepliesStep0 = ["Browse Products", "Request a Quote", "Book a Demo", "Service & Support", "Become a Distributor"];
  const quickRepliesStep1 = ["ICU & Critical Care", "Cardiology", "Anaesthesia", "Renal Care", "Infusion Therapy", "Diagnostics", "Wound Care", "Aesthetics", "Furniture & Equipment"];
  const quickRepliesStep7 = ["Continue on WhatsApp", "Browse Catalog"];

  return (
    <>
      {/* TRIGGER BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Pulse Assistant"
            className="fixed bottom-6 right-6 w-[60px] h-[60px] rounded-full bg-[#14B8A6] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow z-50 group"
          >
            <div className="absolute inset-0 rounded-full border-2 border-[#14B8A6] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 relative z-10">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed z-[100] flex flex-col bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden font-sans border border-slate-200 ${isFullscreen
                ? "inset-0 md:inset-4 md:rounded-2xl"
                : "bottom-0 right-0 w-full h-full md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] md:rounded-2xl"
              }`}
          >
            {/* HEADER */}
            <div className="flex-shrink-0 bg-[#0A1F44] text-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#14B8A6] rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="font-semibold tracking-wide">Pulse Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={initChat} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Restart chat"><RotateCcw size={18} /></button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors hidden md:block" aria-label="Minimize chat"><Minus size={18} /></button>
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors hidden md:block" aria-label="Toggle Fullscreen"><Maximize2 size={18} /></button>
                <button onClick={handleClose} className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors" aria-label="Close chat"><X size={18} /></button>
              </div>
            </div>

            {/* CONFIRMATION OVERLAY */}
            <AnimatePresence>
              {showConfirmClose && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center p-6 text-center"
                >
                  <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-sm w-full">
                    <h4 className="text-lg font-bold text-[#0A1F44] mb-2">End this conversation?</h4>
                    <p className="text-sm text-slate-500 mb-6">Your chat will be cleared.</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => confirmClose(false)} className="px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex-1">No, resume</button>
                      <button onClick={() => confirmClose(true)} className="px-5 py-2.5 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors flex-1">Yes, clear</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PROGRESS BAR (if in progressive form) */}
            {step >= 3 && step <= 6 && (
              <div className="w-full h-1 bg-slate-100">
                <div className="h-full bg-[#14B8A6] transition-all duration-500 ease-out" style={{ width: `${((step - 2) / 4) * 100}%` }}></div>
              </div>
            )}

            {/* CHAT BODY */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 flex flex-col gap-4 bg-white relative">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div className="flex gap-2 items-end">
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-[#0A1F44] flex-shrink-0 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-[#14B8A6]"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                      </div>
                    )}
                    <div
                      className={`px-4 py-2.5 text-[0.95rem] leading-relaxed shadow-sm ${msg.sender === "user"
                          ? "bg-[#14B8A6] text-white rounded-2xl rounded-br-sm"
                          : "bg-[#F1F5F9] text-[#1E293B] rounded-2xl rounded-bl-sm"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[0.65rem] text-slate-400 font-medium">{msg.timestamp}</span>
                    {msg.sender === "user" && <CheckCircle2 className="w-3 h-3 text-[#14B8A6]" />}
                  </div>
                </motion.div>
              ))}

              {/* TYPING INDICATOR */}
              {isThinking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start flex gap-2 items-end">
                  <div className="w-8 h-8 rounded-full bg-[#0A1F44] flex-shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-[#14B8A6]"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                  </div>
                  <div className="bg-[#F1F5F9] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center h-[42px]">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  </div>
                </motion.div>
              )}

              {/* QUICK REPLIES */}
              {!isThinking && step === 0 && (
                <div className="flex flex-wrap gap-2 mt-2 ml-10">
                  {quickRepliesStep0.map((reply, i) => (
                    <motion.button
                      key={reply}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      onClick={() => handleAction(reply)}
                      className="px-4 py-1.5 rounded-full border border-[#14B8A6] text-[#14B8A6] text-sm font-medium hover:bg-[#14B8A6] hover:text-white transition-colors"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              )}
              {!isThinking && step === 1 && (
                <div className="flex flex-wrap gap-2 mt-2 ml-10">
                  {quickRepliesStep1.map((reply, i) => (
                    <motion.button
                      key={reply}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      onClick={() => handleAction(reply)}
                      className="px-4 py-1.5 rounded-full border border-[#14B8A6] text-[#14B8A6] text-sm font-medium hover:bg-[#14B8A6] hover:text-white transition-colors"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              )}
              {!isThinking && step === 6 && (
                <div className="flex gap-2 mt-2 self-end">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setUserData((prev) => ({ ...prev, requirement: "Skipped" }));
                      setStep(7);
                      addBotMessage(`Thanks ${userData.name || "there"}! Our team will reach out within 24 hours.`);
                    }}
                    className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Skip
                  </motion.button>
                </div>
              )}
              {!isThinking && step === 7 && (
                <div className="flex flex-col sm:flex-row gap-2 mt-2 ml-10">
                  {quickRepliesStep7.map((reply, i) => (
                    <motion.button
                      key={reply}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      onClick={() => handleAction(reply)}
                      className="px-5 py-2.5 rounded-xl bg-[#F59E0B] text-[#0A1F44] font-semibold hover:bg-[#fca515] transition-colors shadow-sm"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* FOOTER & INPUT */}
            <div className="flex-shrink-0 bg-white border-t border-slate-100 p-3 pt-4">
              <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200 rounded-full px-2 py-1.5 focus-within:border-[#14B8A6] focus-within:ring-1 focus-within:ring-[#14B8A6]/20 transition-all shadow-inner">
                <button className="p-2 text-slate-400 hover:text-[#14B8A6] transition-colors shrink-0" aria-label="Voice input">
                  <Mic size={20} />
                </button>
                <input
                  type={step === 4 ? "tel" : step === 5 ? "email" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={step === 6 ? "Enter requirement (optional)..." : "Type a message..."}
                  className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-[#0A1F44] placeholder:text-slate-400 min-w-0"
                  disabled={isThinking || step === 0 || step === 1 || step === 7}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isThinking}
                  className="p-2 bg-[#14B8A6] text-white rounded-full hover:bg-[#0d9488] disabled:opacity-50 disabled:hover:bg-[#14B8A6] transition-colors shrink-0 flex items-center justify-center ml-1"
                  aria-label="Send message"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
              <div className="text-center mt-3 mb-1">
                <span className="text-[0.65rem] font-medium text-slate-400 uppercase tracking-widest">Powered by Pulse</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
