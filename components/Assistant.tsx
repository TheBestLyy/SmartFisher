
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronLeft } from 'lucide-react';
import { getFishingAdvice } from '../services/geminiService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface AssistantProps {
    onBack?: () => void;
}

const Assistant: React.FC<AssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "您好！我是您的智能钓鱼顾问。无论你是想问饵料配方、线组搭配，还是找钓位技巧，都可以问我！", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const advice = await getFishingAdvice(input);
    
    setLoading(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, text: advice, sender: 'ai' }]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 pb-safe">
       <div className="px-4 py-3 bg-white shadow-sm border-b border-slate-100 z-10 flex items-center justify-between">
           {onBack && (
               <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
                   <ChevronLeft size={24} />
               </button>
           )}
           <h1 className="text-lg font-bold text-slate-800">钓技问答</h1>
           <div className="w-10"></div> {/* Spacer for alignment */}
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'user' ? 'bg-blue-600 ml-2' : 'bg-green-600 mr-2'
                    }`}>
                        {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
                 <div className="flex flex-row">
                    <div className="w-8 h-8 rounded-full bg-green-600 mr-2 flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="问问看：鲫鱼饵料怎么配..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="ml-2 p-2 bg-blue-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                  <Send size={16} />
              </button>
          </div>
       </div>
    </div>
  );
};

export default Assistant;
