'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, ShieldAlert } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hi there! I am Moto Monk AI. How can I help you find your dream ride today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTakenOver, setIsTakenOver] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('receive_admin_message', (data: Message) => {
      setMessages(prev => [...prev, data]);
      setIsTakenOver(true);
      setIsTyping(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Emit to admin via socket
    socketRef.current?.emit('client_message', { text: inputValue, sender: 'user' });

    if (!isTakenOver) {
      setIsTyping(true);
      // Simulate AI response delay only if human hasn't taken over
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(userMessage.text),
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => {
          // Double check taking over inside the timeout
          if (isTakenOver) return prev;
          return [...prev, botResponse];
        });
        setIsTyping(false);
      }, 1500);
    }
  };

  // Simple mock AI logic for demo purposes
  const getBotResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      return 'Our models range from $5,000 to $25,000 depending on the specifications. Are you looking for a sportbike, cruiser, or adventure model?';
    }
    if (lowerInput.includes('test ride') || lowerInput.includes('book')) {
      return 'I can help you schedule a test ride! Please provide your phone number, and a sales representative will contact you shortly.';
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return 'Hello! How can I assist you with your motorcycle journey today?';
    }
    return 'That sounds interesting! Let me connect you with one of our specialists who can provide more detailed information. Can I get your email address?';
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] z-50 hover:bg-orange-600 transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] bg-card border border-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black/50 border-b border-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {isTakenOver ? 'Support Agent' : 'Moto Monk AI'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isTakenOver ? 'Live Human Support' : 'Usually replies instantly'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isTakenOver && (
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
                    <ShieldAlert className="w-3 h-3" /> Live
                  </span>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/grid-pattern.svg')] bg-center bg-black/20">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.sender === 'user' ? 'bg-gray-800 text-gray-300' : 
                    msg.sender === 'admin' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                    'bg-primary/20 text-primary border border-primary/30'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : 
                     msg.sender === 'admin' ? <ShieldAlert className="w-4 h-4" /> : 
                     <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gray-800 text-white rounded-tr-none' 
                      : msg.sender === 'admin'
                      ? 'bg-red-500/10 border border-red-500/20 text-white rounded-tl-none'
                      : 'bg-primary/10 border border-primary/20 text-white rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 max-w-[85%]"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-primary rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800 bg-black/40">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-gray-900/50 border border-gray-800 text-white pl-4 pr-12 py-3 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-2 text-primary hover:text-orange-400 disabled:opacity-50 disabled:hover:text-primary transition-colors"
                >
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
              <div className="text-center mt-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Powered by Moto Monk AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
