import { useState, useRef, useEffect } from "react";
import { Send, Plus, Paperclip, MessageSquare, Settings, Download, User, Trash2, Pencil, X, Check, Mic, Image as ImageIcon, Home, Shield, Mail, FileText, Clock, Copy, RotateCcw, ThumbsUp, ThumbsDown, Sparkles, Menu, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import React from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

const suggestionChips = [
  { icon: Shield, label: "Scan a website", action: "scan-website", gradient: "from-purple-500 to-violet-600" },
  { icon: Mail, label: "Analyze phishing email", action: "analyze-phishing", gradient: "from-violet-500 to-purple-600" },
  { icon: FileText, label: "Security best practices", action: "security-tips", gradient: "from-indigo-500 to-purple-600" },
  { icon: Zap, label: "Quick security check", action: "quick-check", gradient: "from-purple-600 to-pink-600" },
];

export function ChatbotPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "New Chat",
      timestamp: new Date(),
      messages: [],
    },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const simulateStreaming = async (messageId: string, fullContent: string) => {
    const words = fullContent.split(" ");
    let currentContent = "";

    for (let i = 0; i < words.length; i++) {
      currentContent += (i > 0 ? " " : "") + words[i];
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: conv.messages.map(msg =>
              msg.id === messageId
                ? { ...msg, content: currentContent, isStreaming: i < words.length - 1 }
                : msg
            ),
          };
        }
        return conv;
      }));

      await new Promise(resolve => setTimeout(resolve, 30));
    }

    setIsStreaming(false);
  };

  const handleSend = async (messageContent?: string) => {
    const contentToSend = messageContent || input.trim();
    if (!contentToSend || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: contentToSend,
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage, assistantMessage];
        const newTitle = conv.messages.length === 0 ? contentToSend.slice(0, 30) : conv.title;
        return {
          ...conv,
          title: newTitle,
          messages: updatedMessages,
        };
      }
      return conv;
    }));

    setInput("");
    setAttachment(null);
    setIsStreaming(true);

    const responses = [
      `Great question! Let me explain that in detail.\n\nTo address "${contentToSend}", here's what you need to know:\n\n**Security Best Practices**\n\nAlways validate and sanitize user inputs to prevent common vulnerabilities like SQL injection and XSS attacks.\n\n**Implementation Steps:**\n1. Use parameterized queries for database operations\n2. Implement proper authentication and authorization\n3. Keep your dependencies up to date\n4. Use HTTPS for all communications\n\n**Example Code:**\n\`\`\`javascript\nfunction validateInput(userInput) {\n  const sanitized = userInput.replace(/[<>]/g, '');\n  return sanitized;\n}\n\`\`\`\n\n**Additional Resources:** Check out OWASP's guidelines for more comprehensive security practices.\n\nWould you like me to elaborate on any of these points?`,
      `I can help with that! Here's a comprehensive overview:\n\n**Understanding the Concept**\n\nThis is an important aspect of cybersecurity that often gets overlooked. The key is to implement defense in depth.\n\n**Key Points to Remember:**\n• Always follow the principle of least privilege\n• Implement proper logging and monitoring\n• Regular security audits are essential\n• Keep your team educated on security best practices\n\n**Practical Application:**\n\nIn real-world scenarios, you'd want to combine multiple security layers. This includes network security, application security, and user awareness training.\n\nLet me know if you'd like specific code examples or more detailed explanations!`,
      `Excellent question! Let me break this down for you.\n\n**Overview**\n\nThis is a critical security consideration that every developer should understand. The impact of getting this wrong can be severe.\n\n**Technical Details:**\n\n1. First, understand the threat model\n2. Implement appropriate countermeasures\n3. Test your security controls regularly\n4. Monitor for suspicious activity\n\n**Common Pitfalls to Avoid:**\n• Don't rely on client-side validation alone\n• Never store sensitive data in plain text\n• Avoid security through obscurity\n• Don't skip security updates\n\n**Recommended Approach:**\n\nUse industry-standard libraries and frameworks that have been battle-tested. Don't try to roll your own cryptography or authentication systems.\n\nIs there a specific aspect you'd like me to dive deeper into?`,
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    await simulateStreaming(assistantMessage.id, randomResponse);
  };

  const handleSuggestionClick = (action: string, label: string) => {
    const prompts: Record<string, string> = {
      "scan-website": "How do I scan a website for vulnerabilities?",
      "analyze-phishing": "Help me analyze a phishing email for threats",
      "security-tips": "What are the top cybersecurity best practices I should follow?",
      "quick-check": "Can you perform a quick security check on my system?",
    };
    
    handleSend(prompts[action] || label);
  };

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
      messages: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    toast.success("New chat created");
  };

  const handleDeleteConversation = (id: string) => {
    if (conversations.length === 1) {
      toast.error("Cannot delete the last conversation");
      return;
    }
    
    setConversations(prev => prev.filter(c => c.id !== id));
    
    if (id === currentConversationId) {
      const remaining = conversations.filter(c => c.id !== id);
      setCurrentConversationId(remaining[0].id);
    }
    
    toast.success("Conversation deleted");
  };

  const handleStartEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveEdit = () => {
    if (!editingTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    
    setConversations(prev => prev.map(c => 
      c.id === editingId ? { ...c, title: editingTitle.trim() } : c
    ));
    setEditingId(null);
    setEditingTitle("");
    toast.success("Title updated");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleExport = () => {
    const conv = conversations.find(c => c.id === currentConversationId);
    if (!conv || conv.messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    const content = conv.messages.map(m => 
      `${m.role.toUpperCase()} [${m.timestamp.toLocaleString()}]:\n${m.content}\n\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conv.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Chat exported successfully");
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      toast.success(`File attached: ${file.name}`);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("Voice recording started");
    } else {
      toast.info("Voice recording stopped");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Message copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateResponse = () => {
    if (messages.length < 2) return;
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMessage) {
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: conv.messages.slice(0, -1)
          };
        }
        return conv;
      }));
      handleSend(lastUserMessage.content);
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <div className="flex h-full bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10 overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleAttachment}
          accept=".txt,.pdf,.doc,.docx,.jpg,.png"
        />

        {/* Enhanced Conversation History Sidebar */}
        <AnimatePresence mode="wait">
          {showChatList && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-80 flex-shrink-0 border-r border-gray-200/80 dark:border-gray-800/80 backdrop-blur-xl relative overflow-hidden"
              style={{
                background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95))",
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Sidebar Header */}
                <motion.div 
                  className="p-4 border-b border-gray-200/80 dark:border-gray-800/80"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.button
                    onClick={handleNewChat}
                    className="w-full px-4 py-3 rounded-xl font-medium text-white relative overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      New Chat
                    </span>
                  </motion.button>
                </motion.div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {conversations.map((conv, index) => {
                      const isActive = conv.id === currentConversationId;
                      const isEditing = editingId === conv.id;

                      return (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                        >
                          <motion.div
                            className={`group relative rounded-xl overflow-hidden transition-all ${
                              isActive ? "ring-2 ring-purple-500/50" : ""
                            }`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-purple-500/10"
                                layoutId="activeChat"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}

                            <div
                              className={`relative px-4 py-3 cursor-pointer backdrop-blur-sm ${
                                isActive 
                                  ? "bg-white/80 dark:bg-gray-800/80" 
                                  : "bg-white/40 hover:bg-white/60 dark:bg-gray-800/40 dark:hover:bg-gray-800/60"
                              }`}
                              onClick={() => !isEditing && setCurrentConversationId(conv.id)}
                            >
                              <div className="flex items-start gap-3">
                                <motion.div
                                  className="mt-1 p-2 rounded-lg"
                                  style={{
                                    background: isActive 
                                      ? "linear-gradient(135deg, #7C3AED, #6D28D9)"
                                      : "linear-gradient(135deg, #E9D5FF, #DDD6FE)",
                                  }}
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <MessageSquare className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-600"}`} />
                                </motion.div>

                                <div className="flex-1 min-w-0">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        className="h-8 text-sm"
                                        autoFocus
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleSaveEdit();
                                          if (e.key === "Escape") handleCancelEdit();
                                        }}
                                      />
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleSaveEdit}>
                                        <Check className="w-4 h-4 text-green-600" />
                                      </Button>
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleCancelEdit}>
                                        <X className="w-4 h-4 text-red-600" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
                                        {conv.title}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                          {formatRelativeTime(conv.timestamp)}
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">
                                          {conv.messages.length} messages
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {!isEditing && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <motion.button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartEdit(conv);
                                          }}
                                          className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Pencil className="w-3.5 h-3.5 text-purple-600" />
                                        </motion.button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Rename</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <motion.button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteConversation(conv.id);
                                          }}
                                          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                        </motion.button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delete</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Sidebar Footer */}
                <motion.div 
                  className="p-4 border-t border-gray-200/80 dark:border-gray-800/80 space-y-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={handleExport}
                        className="w-full px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all bg-white/50 dark:bg-gray-800/50"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ color: "#7C3AED" }}
                      >
                        <Download className="w-4 h-4" />
                        Export Chat
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download conversation as text file</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => setShowSettings(true)}
                        className="w-full px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open settings</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full relative">
          {/* Enhanced Header */}
          <motion.div
            className="flex items-center justify-between px-6 py-4 border-b border-gray-200/80 dark:border-gray-800/80 backdrop-blur-xl relative overflow-hidden"
            style={{ 
              background: "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95))",
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setShowChatList(!showChatList)}
                    className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors border border-gray-200 dark:border-gray-700"
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Menu className="w-5 h-5 text-purple-600" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showChatList ? "Hide" : "Show"} conversation history</p>
                </TooltipContent>
              </Tooltip>

              <motion.div
                className="flex items-center gap-3 px-4 py-2 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                }}
                whileHover={{ scale: 1.02 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">Cyber Guard AI</span>
              </motion.div>
            </div>

            <motion.div
              className="relative z-10 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {messages.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={handleRegenerateResponse}
                      className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors border border-gray-200 dark:border-gray-700"
                      whileHover={{ scale: 1.05, rotate: -180 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isStreaming}
                    >
                      <RotateCcw className="w-5 h-5 text-purple-600" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Regenerate last response</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </motion.div>
          </motion.div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto relative"
            style={{ 
              background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(249, 250, 251, 0.8))",
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(124, 58, 237, 0.03) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(109, 40, 217, 0.03) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center px-4 pb-32 relative z-10">
                <div className="max-w-2xl w-full text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      className="mb-8 inline-block"
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.div
                        className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                        }}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <Sparkles className="w-12 h-12 text-white relative z-10" />
                      </motion.div>
                    </motion.div>

                    <motion.h1
                      className="mb-3 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 bg-clip-text text-transparent"
                      style={{ 
                        fontSize: "3rem",
                        fontWeight: 700,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Hey there,
                    </motion.h1>
                    <motion.h2
                      className="text-4xl mb-4"
                      style={{ color: "#1E1E1E" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      What can I help you with?
                    </motion.h2>
                    <motion.p
                      className="text-gray-600 mb-12 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Ask me anything about cybersecurity, threat analysis, or best practices
                    </motion.p>

                    {/* Enhanced Suggestion Chips */}
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      {suggestionChips.map((chip, index) => {
                        const Icon = chip.icon;
                        return (
                          <motion.button
                            key={chip.action}
                            onClick={() => handleSuggestionClick(chip.action, chip.label)}
                            className="relative group overflow-hidden rounded-2xl p-6 text-left border-2 border-gray-200 hover:border-transparent transition-all"
                            style={{
                              background: "white",
                            }}
                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ 
                              delay: 0.7 + index * 0.1,
                              type: "spring",
                              stiffness: 200,
                            }}
                            whileHover={{ 
                              scale: 1.05,
                              y: -8,
                              rotateX: 5,
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-br ${chip.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            />
                            
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100"
                              animate={{
                                x: ["-100%", "100%"],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />

                            <div className="relative z-10">
                              <motion.div
                                className="mb-3 inline-block p-3 rounded-xl bg-gradient-to-br"
                                style={{
                                  background: `linear-gradient(135deg, ${chip.gradient.includes('purple-500') ? '#7C3AED' : '#6D28D9'}, ${chip.gradient.includes('pink') ? '#DB2777' : '#5B21B6'})`,
                                }}
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Icon className="w-6 h-6 text-white" />
                              </motion.div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors mb-2">
                                {chip.label}
                              </h3>
                              <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                                Get instant AI-powered assistance
                              </p>
                            </div>

                            <motion.div
                              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ x: 4 }}
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </motion.div>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 relative z-10">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <EnhancedMessageBubble 
                      key={message.id} 
                      message={message} 
                      index={index}
                      onCopy={handleCopyMessage}
                      copiedId={copiedId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <motion.div
            className="px-6 pb-8 pt-6 relative"
            style={{
              background: "linear-gradient(to top, rgba(255, 255, 255, 0.98) 60%, transparent)",
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
          >
            <div className="max-w-4xl mx-auto">
              <AnimatePresence>
                {attachment && (
                  <motion.div
                    className="mb-3 flex items-center gap-3 px-5 py-3 rounded-2xl relative overflow-hidden border-2"
                    style={{
                      background: "linear-gradient(135deg, #F3E8FF, #EDE9FE)",
                      borderColor: "#7C3AED",
                    }}
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="p-2 rounded-xl"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Paperclip className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="text-sm flex-1 font-medium text-purple-900">{attachment.name}</span>
                    <motion.button
                      onClick={() => setAttachment(null)}
                      className="p-2 hover:bg-purple-200/50 rounded-xl transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" style={{ color: "#7C3AED" }} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                className="relative rounded-3xl border-2 overflow-hidden"
                style={{
                  background: "white",
                  borderColor: "#E5E7EB",
                  boxShadow: "0 8px 32px rgba(124, 58, 237, 0.08)",
                }}
                whileHover={{ 
                  boxShadow: "0 12px 48px rgba(124, 58, 237, 0.15)",
                  borderColor: "#C4B5FD",
                  scale: 1.005,
                }}
                animate={isStreaming ? {
                  boxShadow: ["0 8px 32px rgba(124, 58, 237, 0.15)", "0 8px 32px rgba(109, 40, 217, 0.25)", "0 8px 32px rgba(124, 58, 237, 0.15)"],
                } : {}}
                transition={{ duration: 2, repeat: isStreaming ? Infinity : 0 }}
              >
                {/* Gradient border effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500 opacity-0 group-hover:opacity-100"
                  style={{ padding: "2px", borderRadius: "24px" }}
                  animate={{
                    background: [
                      "linear-gradient(0deg, #7C3AED, #6D28D9, #7C3AED)",
                      "linear-gradient(360deg, #7C3AED, #6D28D9, #7C3AED)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative bg-white rounded-3xl p-4">
                  <div className="flex items-end gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 rounded-2xl transition-all flex-shrink-0"
                          style={{
                            background: "linear-gradient(135deg, #F3E8FF, #EDE9FE)",
                          }}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 15,
                            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                          }}
                          whileTap={{ scale: 0.9 }}
                          title="Add attachment"
                        >
                          <Plus className="w-5 h-5 text-purple-600" />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Attach file</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything about cybersecurity..."
                      className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0 min-h-[32px] max-h-[200px] bg-transparent text-base placeholder:text-gray-400"
                      style={{
                        color: "#1E1E1E",
                      }}
                      rows={1}
                      disabled={isStreaming}
                    />

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            onClick={handleVoiceInput}
                            className={`p-3 rounded-2xl transition-all ${
                              isRecording ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-purple-100 to-violet-100"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            animate={isRecording ? {
                              scale: [1, 1.1, 1],
                            } : {}}
                            transition={isRecording ? {
                              duration: 1,
                              repeat: Infinity,
                            } : {}}
                            title="Voice input"
                          >
                            <Mic 
                              className={`w-5 h-5 ${isRecording ? "text-white" : "text-purple-600"}`}
                            />
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRecording ? "Stop recording" : "Start voice input"}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 rounded-2xl transition-all bg-gradient-to-br from-purple-100 to-violet-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Upload image"
                          >
                            <ImageIcon className="w-5 h-5 text-purple-600" />
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload image</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isStreaming}
                            className={`p-3 rounded-2xl transition-all ${
                              input.trim() && !isStreaming
                                ? "bg-gradient-to-br from-purple-600 to-violet-600"
                                : "bg-gradient-to-br from-gray-200 to-gray-300"
                            }`}
                            whileHover={input.trim() && !isStreaming ? { 
                              scale: 1.1,
                              rotate: -10,
                            } : {}}
                            whileTap={input.trim() && !isStreaming ? { scale: 0.9 } : {}}
                            animate={isStreaming ? {
                              rotate: 360,
                            } : {}}
                            transition={isStreaming ? {
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            } : {}}
                          >
                            <Send className={`w-5 h-5 ${input.trim() && !isStreaming ? "text-white" : "text-gray-500"}`} />
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send message</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.p
                className="text-center text-xs text-gray-500 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Cyber Guard AI can make mistakes. Verify important information.
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Settings className="w-6 h-6 text-purple-600" />
                Settings
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <motion.div 
                className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Appearance
                </h4>
                <p className="text-sm text-gray-600">Customize your chat experience and theme preferences</p>
              </motion.div>
              <motion.div 
                className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Data & Privacy
                </h4>
                <p className="text-sm text-gray-600">Manage your data retention and privacy settings</p>
              </motion.div>
              <motion.div 
                className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  About
                </h4>
                <p className="text-sm text-gray-600">Cyber Guard AI v1.0.0 - Advanced Cybersecurity Assistant</p>
              </motion.div>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setShowSettings(false)}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

interface EnhancedMessageBubbleProps {
  message: Message;
  index: number;
  onCopy: (content: string, id: string) => void;
  copiedId: string | null;
}

const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({ 
  message, 
  index,
  onCopy,
  copiedId,
}) => {
  const isUser = message.role === "user";
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: index * 0.05 + 0.1
          }}
          whileHover={{ scale: 1.1, rotate: 360 }}
        >
          <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-purple-500/20">
            <AvatarFallback
              className="text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              }}
            >
              <Sparkles className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}

      <div className={`max-w-[75%] ${isUser ? "order-first" : ""} space-y-2`}>
        <motion.div
          className="relative group rounded-2xl overflow-hidden"
          whileHover={{ 
            scale: 1.01,
          }}
        >
          {/* Message content */}
          <motion.div
            className="px-6 py-4 relative"
            style={{
              background: isUser 
                ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)"
                : "white",
              color: isUser ? "white" : "#1E1E1E",
              border: isUser ? "none" : "2px solid #E5E7EB",
            }}
            whileHover={{ 
              boxShadow: isUser 
                ? "0 8px 32px rgba(124, 58, 237, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Animated gradient overlay for AI messages */}
            {!isUser && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}

            <div className="prose prose-sm max-w-none relative z-10">
              <div className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                {message.content}
                {message.isStreaming && (
                  <motion.span
                    className="inline-block w-1 h-4 ml-1"
                    style={{ background: isUser ? "white" : "#7C3AED" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Message actions */}
          <AnimatePresence>
            {showActions && !isUser && (
              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => onCopy(message.content, message.id)}
                      className="p-2 rounded-lg hover:bg-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedId === message.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copiedId === message.id ? "Copied!" : "Copy message"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      className="p-2 rounded-lg hover:bg-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ThumbsUp className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Good response</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      className="p-2 rounded-lg hover:bg-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ThumbsDown className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bad response</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Timestamp */}
        <motion.div
          className="flex items-center gap-2 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.3 }}
        >
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </motion.div>
      </div>

      {isUser && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: index * 0.05 + 0.1
          }}
          whileHover={{ scale: 1.1, rotate: -360 }}
        >
          <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-purple-200">
            <AvatarFallback 
              style={{ 
                background: "linear-gradient(135deg, #F3E8FF, #EDE9FE)", 
                color: "#7C3AED", 
                fontSize: "11px",
                fontWeight: 600
              }}
            >
              YM
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.div>
  );
};
