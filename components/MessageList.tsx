
import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { ChatSummary } from '../types';

interface MessageListProps {
  onBack: () => void;
  onChatClick: (userId: string) => void;
}

const mockChats: ChatSummary[] = [
    {
        userId: 'user_1',
        userName: '路亚阿强',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        lastMessage: '好的，祝你爆护！🎣',
        timestamp: '刚刚',
        unreadCount: 0
    },
    {
        userId: 'user_2',
        userName: '台钓小王子',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prince',
        lastMessage: '周末约一波？我知道个新塘口。',
        timestamp: '10分钟前',
        unreadCount: 2
    },
    {
        userId: 'sys_notify',
        userName: '系统通知',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=System',
        lastMessage: '恭喜！您的作品《千岛湖巨物》已被精选推荐。',
        timestamp: '2小时前',
        unreadCount: 1
    }
];

const MessageList: React.FC<MessageListProps> = ({ onBack, onChatClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-safe">
       {/* Header */}
       <div className="bg-white px-4 py-3 shadow-sm border-b border-slate-100 flex items-center justify-between z-10 sticky top-0">
           <div className="flex items-center">
               <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
                   <ChevronLeft size={24} />
               </button>
               <h1 className="text-lg font-bold text-slate-900 ml-2">消息</h1>
           </div>
           <button className="text-slate-400 p-2">
               <MoreHorizontal size={20} />
           </button>
       </div>

       {/* List */}
       <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {mockChats.map(chat => (
               <div 
                  key={chat.userId}
                  onClick={() => onChatClick(chat.userId)}
                  className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center active:bg-slate-50 transition-colors cursor-pointer"
               >
                   <div className="relative flex-shrink-0">
                       <img src={chat.userAvatar} alt={chat.userName} className="w-12 h-12 rounded-full bg-slate-100 object-cover" />
                       {chat.unreadCount > 0 && (
                           <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                               {chat.unreadCount}
                           </div>
                       )}
                   </div>
                   
                   <div className="ml-4 flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-1">
                           <h3 className="font-bold text-slate-900 text-sm truncate">{chat.userName}</h3>
                           <span className="text-[10px] text-slate-400 flex-shrink-0">{chat.timestamp}</span>
                       </div>
                       <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                           {chat.lastMessage}
                       </p>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

export default MessageList;
