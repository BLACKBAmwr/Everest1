
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/gemini';
import { STORE_NAME } from '../constants';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const aiResponse = await getChatResponse(userMsg, history);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 gold-bg rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 float"
        >
          <MessageSquare className="w-8 h-8 text-black" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[92vw] md:w-[400px] h-[580px] bg-[#0a0a0a] rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-50 flex flex-col border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-5 gold-bg flex justify-between items-center text-black shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 bg-black/10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] leading-none mb-1.5">مساعد إيفرست الذكي</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse shadow-[0_0_4px_#16a34a]"></div>
                  <span className="text-[11px] font-bold opacity-80 tracking-wide">متصل الآن</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-2.5 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-white/[0.02]">
            {messages.length === 0 && (
              <div className="text-center py-12 px-6">
                <Bot className="w-10 h-10 mx-auto mb-4 text-[#D4AF37] opacity-20" />
                <p className="text-sm text-gray-400">مرحباً! كيف يمكنني مساعدتك في طلب الروبكس اليوم؟</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`relative p-3.5 text-sm leading-relaxed rounded-2xl transition-all shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#D4AF37] text-black rounded-tr-none ml-4' 
                      : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none mr-4'
                  }`}
                  style={{ width: 'fit-content', maxWidth: '85%' }}
                >
                  <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 rounded-tl-none flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-black/60">
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب استفسارك هنا..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 pr-12 focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 gold-text hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
              >
                <Send className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
