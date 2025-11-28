
import React, { useState } from 'react';
import { ChevronLeft, MoreHorizontal, MapPin, Heart, MessageCircle, Share2, Bookmark, Send } from 'lucide-react';
import { Post, Comment } from '../types';

interface PostDetailProps {
  postId: string;
  onBack: () => void;
}

// Mock Data Helper
const getMockPost = (id: string): Post => {
    // Return a dummy post based on ID
    return {
        id: id,
        user: {
            id: 'user_1',
            name: '路亚阿强',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            level: '路亚达人'
        },
        content: '这是详情页展示的内容。今天在千岛湖解锁米级翘嘴！这个窗口期抓得太准了，用的米诺，收线要慢。兄弟们，这波什么水平？',
        images: [
            'https://picsum.photos/600/600?random=100',
            'https://picsum.photos/600/600?random=1002'
        ],
        location: '杭州·千岛湖',
        likes: 128,
        comments: 2,
        commentsList: [
            {
                id: 'c1',
                user: { name: '钓鱼佬不空军', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
                text: '太强了！求米诺型号链接！',
                timestamp: '1小时前'
            },
            {
                id: 'c2',
                user: { name: 'Suki', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suki' },
                text: '这个体型确实少见，羡慕了。',
                timestamp: '30分钟前'
            }
        ],
        timestamp: '2小时前',
        isLiked: false,
        isBookmarked: true,
        tags: ['路亚', '翘嘴', '巨物']
    };
};

const PostDetail: React.FC<PostDetailProps> = ({ postId, onBack }) => {
  const [post, setPost] = useState<Post>(getMockPost(postId));
  const [commentInput, setCommentInput] = useState('');

  const toggleLike = () => {
    setPost(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const toggleBookmark = () => {
      setPost(prev => ({
          ...prev,
          isBookmarked: !prev.isBookmarked
      }));
  };

  const handleSendComment = () => {
      if(!commentInput.trim()) return;
      const newComment: Comment = {
          id: Date.now().toString(),
          user: { name: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'},
          text: commentInput,
          timestamp: '刚刚'
      };
      setPost(prev => ({
          ...prev,
          comments: prev.comments + 1,
          commentsList: [...(prev.commentsList || []), newComment]
      }));
      setCommentInput('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-safe relative z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-4 py-3 border-b border-slate-100 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
            <ChevronLeft size={24} />
        </button>
        <div className="flex items-center space-x-2">
            <img src={post.user.avatar} className="w-8 h-8 rounded-full bg-slate-100" alt="avatar" />
            <span className="font-bold text-sm text-slate-900">{post.user.name}</span>
        </div>
        <button className="p-2 -mr-2 text-slate-600">
            <MoreHorizontal size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
          {/* Post Content */}
          <div className="p-4">
              <div className="text-slate-800 text-base leading-relaxed mb-4">
                  {post.content}
              </div>
               <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-blue-600 text-sm">#{tag}</span>
                    ))}
                </div>
              
              {/* Media Display */}
              <div className="space-y-2 mb-4">
                  {post.video ? (
                      <div className="rounded-xl overflow-hidden bg-black">
                          <video src={post.video} controls className="w-full h-auto max-h-96" />
                      </div>
                  ) : (
                      post.images.map((img, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden bg-slate-50">
                            <img src={img} alt={`Content ${idx}`} className="w-full h-auto" />
                        </div>
                      ))
                  )}
              </div>

              <div className="flex items-center text-xs text-slate-500 mb-6 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
                    <MapPin size={14} className="mr-1 text-blue-500" />
                    {post.location}
                    <span className="mx-2 text-slate-300">|</span>
                    {post.timestamp}
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center px-4">
                   <button onClick={toggleLike} className="flex flex-col items-center space-y-1">
                       <Heart size={24} className={post.isLiked ? 'fill-red-500 text-red-500' : 'text-slate-600'} />
                       <span className="text-xs text-slate-500">{post.likes}</span>
                   </button>
                   <button className="flex flex-col items-center space-y-1">
                       <MessageCircle size={24} className="text-slate-600" />
                       <span className="text-xs text-slate-500">{post.comments}</span>
                   </button>
                   <button onClick={toggleBookmark} className="flex flex-col items-center space-y-1">
                       <Bookmark size={24} className={post.isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'} />
                       <span className="text-xs text-slate-500">收藏</span>
                   </button>
                   <button className="flex flex-col items-center space-y-1">
                       <Share2 size={24} className="text-slate-600" />
                       <span className="text-xs text-slate-500">分享</span>
                   </button>
              </div>
          </div>

          {/* Comments Section */}
          <div className="border-t-8 border-slate-50">
              <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-4">全部评论 ({post.comments})</h3>
                  <div className="space-y-6">
                      {post.commentsList?.map(comment => (
                          <div key={comment.id} className="flex items-start space-x-3">
                              <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full bg-slate-100" />
                              <div className="flex-1 border-b border-slate-50 pb-4">
                                  <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm font-bold text-slate-700">{comment.user.name}</span>
                                      <span className="text-xs text-slate-400">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-slate-800 leading-relaxed">{comment.text}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Footer Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 pb-safe flex items-center z-20">
          <input 
            type="text" 
            placeholder="说点什么..." 
            className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button 
            onClick={handleSendComment}
            disabled={!commentInput.trim()}
            className="ml-3 p-2 bg-blue-600 rounded-full text-white disabled:opacity-50"
          >
              <Send size={18} />
          </button>
      </div>
    </div>
  );
};

export default PostDetail;
