'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Bot, User, Clock, ShieldAlert, Send, MessageSquare } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  time: string;
}

interface ChatSession {
  sessionId: string;
  name: string; // fallback to 'Website Visitor'
  messages: ChatMessage[];
  lastMessage: string;
  time: string;
  unread: boolean;
  isHumanMode: boolean;
  isOnline: boolean;
}

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.emit('join_admin');

    socketRef.current.on('receive_client_message', (data: { text: string, sender: 'user' | 'bot', sessionId: string }) => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: data.text,
        sender: data.sender,
        time: timeStr
      };

      setChats(prev => {
        const existing = prev.find(c => c.sessionId === data.sessionId);
        if (existing) {
          return prev.map(c => c.sessionId === data.sessionId ? {
            ...c,
            messages: [...c.messages, newMessage],
            lastMessage: data.text,
            time: timeStr,
            unread: c.sessionId !== activeSessionId
          } : c);
        } else {
          return [{
            sessionId: data.sessionId,
            name: `Visitor ${data.sessionId.substring(0, 4)}`,
            messages: [newMessage],
            lastMessage: data.text,
            time: timeStr,
            unread: data.sessionId !== activeSessionId,
            isHumanMode: false,
            isOnline: true
          }, ...prev];
        }
      });
    });

    socketRef.current.on('client_disconnected', (sessionId: string) => {
      setChats(prev => prev.map(c => c.sessionId === sessionId ? { ...c, isOnline: false } : c));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeSessionId]);

  const activeChat = chats.find(c => c.sessionId === activeSessionId);

  const toggleTakeover = () => {
    if (!activeSessionId) return;
    setChats(prev => prev.map(c => c.sessionId === activeSessionId ? { ...c, isHumanMode: !c.isHumanMode } : c));
  };

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeSessionId) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'admin',
      time: timeStr
    };

    // Emit to client
    socketRef.current?.emit('admin_message', { text: inputValue, sessionId: activeSessionId });

    // Update local state
    setChats(prev => prev.map(c => c.sessionId === activeSessionId ? {
      ...c,
      messages: [...c.messages, newMsg],
      lastMessage: inputValue,
      time: timeStr
    } : c));

    setInputValue('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Live AI Chats</h1>
        <p className="text-gray-400 mt-1">Monitor real-time interactions and take over conversations when needed.</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col bg-card border border-gray-800 rounded-2xl overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-black border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No active live chats.</p>
                <p className="text-xs mt-2">Open the homepage and use the chat widget to start a session.</p>
              </div>
            )}
            {chats.map((chat) => (
              <button
                key={chat.sessionId}
                onClick={() => {
                  setActiveSessionId(chat.sessionId);
                  setChats(prev => prev.map(c => c.sessionId === chat.sessionId ? { ...c, unread: false } : c));
                }}
                className={`w-full p-4 text-left border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors flex items-start gap-4 ${
                  activeSessionId === chat.sessionId ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shrink-0 relative">
                  <User className="w-5 h-5 text-gray-300" />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-card rounded-full ${chat.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-medium truncate ${activeSessionId === chat.sessionId ? 'text-primary' : 'text-white'}`}>
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate flex items-center gap-1">
                    {chat.isHumanMode && <ShieldAlert className="w-3 h-3 text-red-400" />}
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 self-center shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Chat View */}
        <div className="hidden md:flex flex-1 flex-col bg-card border border-gray-800 rounded-2xl overflow-hidden relative shadow-xl">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative">
                    <User className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">{activeChat.name}</h2>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeChat.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                      {activeChat.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleTakeover}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      activeChat.isHumanMode 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                        : 'bg-primary hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                    }`}
                  >
                    {activeChat.isHumanMode ? (
                      <>Return to AI Mode</>
                    ) : (
                      <><ShieldAlert className="w-4 h-4" /> Takeover Chat</>
                    )}
                  </button>
                  <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('/grid-pattern.svg')] bg-center">
                {activeChat.messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? '' : 'ml-auto flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      msg.sender === 'user' ? 'bg-gray-700' : 
                      msg.sender === 'admin' ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' :
                      'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4 text-gray-300" /> : 
                       msg.sender === 'admin' ? <ShieldAlert className="w-4 h-4" /> :
                       <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}>
                      <div className={`px-5 py-3 rounded-2xl ${
                        msg.sender === 'user' 
                          ? 'bg-gray-800 text-white rounded-tl-none' 
                          : msg.sender === 'admin'
                          ? 'bg-red-500/10 border border-red-500/20 text-white rounded-tr-none'
                          : 'bg-primary/10 border border-primary/20 text-white rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 px-1">
                        <Clock className="w-3 h-3" />
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-800 bg-black/40">
                {!activeChat.isHumanMode ? (
                  <div className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-gray-500 text-sm flex items-center">
                    Viewing in read-only mode. Click &quot;Takeover Chat&quot; to message the user.
                  </div>
                ) : (
                  <form onSubmit={handleSendAdminMessage} className="relative flex items-center">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message as an agent..."
                      disabled={!activeChat.isOnline}
                      className="w-full bg-gray-900/50 border border-gray-800 text-white pl-4 pr-12 py-3.5 rounded-xl text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-50"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim() || !activeChat.isOnline}
                      className="absolute right-2 p-2 text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Select a conversation to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
