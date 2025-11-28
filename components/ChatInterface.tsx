
import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, MoreHorizontal } from 'lucide-react';

interface ChatInterfaceProps {
    userId: string;
    onBack: () => void;
}

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, onBack }) => {
    // Mock user lookup
    const userName = userId === 'user_1' ? '路亚阿强' : (userId === 'user_2' ? '台钓小王子' : '钓鱼佬');
    const userAvatar = userId === 'user_1' 
        ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' 
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: '兄弟，上次那个钓点具体在哪个位置？', sender: 'me', timestamp: '昨天 14:20' },
        { id: 2, text: '就在青山湖大桥下面，东边那个湾子里。', sender: 'other', timestamp: '昨天 14:35' },
        { id: 3, text: '水深大概多少？需要打窝吗？', sender: 'me', timestamp: '昨天 14:36' },
        { id: 4, text: '大概3米左右，建议打点重窝，这几天鲤鱼开口不错。', sender: 'other', timestamp: '昨天 14:40' },
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        
        const newMsg: Message = {
            id: Date.now(),
            text: input,
            sender: 'me',
            timestamp: '刚刚'
        };
        
        setMessages([...messages, newMsg]);
        setInput('');

        // Simulate reply
        setTimeout(() => {
            const replyMsg: Message = {
                id: Date.now() + 1,
                text: '好的，祝你爆护！🎣',
                sender: 'other',
                timestamp: '刚刚'
            };
            setMessages(prev => [...prev, replyMsg]);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 pb-safe">
            {/* Header */}
            <div className="bg-white px-4 py-3 shadow-sm border-b border-slate-100 flex items-center justify-between z-10">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="ml-2 flex items-center">
                        <img src={userAvatar} className="w-8 h-8 rounded-full bg-slate-100" alt="avatar" />
                        <span className="font-bold text-slate-900 ml-2">{userName}</span>
                    </div>
                </div>
                <button className="p-2 text-slate-400">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex flex-col max-w-[75%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.sender === 'me' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                                {msg.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-200 p-4 pb-safe">
                <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
                    <input 
                        type="text" 
                        placeholder="发送消息..." 
                        className="flex-1 bg-transparent outline-none text-sm text-slate-900"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="ml-2 p-1.5 bg-blue-600 rounded-full text-white disabled:opacity-50 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
