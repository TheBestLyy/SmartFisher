import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Post, Comment } from '../types';

interface CommentsSheetProps {
  post: Post;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

const CommentsSheet: React.FC<CommentsSheetProps> = ({ post, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for animation
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment);
    setNewComment('');
    
    // Scroll to bottom after adding
    setTimeout(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div 
        className={`bg-white w-full max-w-md rounded-t-3xl shadow-2xl h-[75vh] flex flex-col transform transition-transform duration-300 ${isClosing ? 'translate-y-full' : 'translate-y-0'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <div className="w-8"></div> {/* Spacer */}
            <h3 className="font-bold text-slate-800">
                评论 ({post.commentsList?.length || 0})
            </h3>
            <button 
                onClick={handleClose}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
                <X size={16} />
            </button>
        </div>

        {/* Comments List */}
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6"
        >
            {(!post.commentsList || post.commentsList.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <p className="text-sm">暂无评论，快来抢沙发吧！</p>
                </div>
            ) : (
                post.commentsList.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                        <img 
                            src={comment.user.avatar} 
                            alt={comment.user.name} 
                            className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0"
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-600">{comment.user.name}</span>
                                <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                                {comment.text}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white pb-safe">
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
                <input 
                    type="text" 
                    placeholder="说点什么..." 
                    className="flex-1 bg-transparent text-sm outline-none placeholder-slate-400"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    autoFocus
                />
                <button 
                    onClick={handleSubmit}
                    disabled={!newComment.trim()}
                    className="ml-2 p-1.5 bg-blue-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={14} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSheet;