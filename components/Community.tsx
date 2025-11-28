
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal, Plus, Bookmark, Bell } from 'lucide-react';
import { Post, Comment } from '../types';
import CommentsSheet from './CommentsSheet';
import ImagePreview from './ImagePreview';

interface CommunityProps {
  onComposeClick: () => void;
  onUserClick: (userId: string) => void;
  onMessageClick: () => void; // New prop
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: 'user_1',
      name: '路亚阿强',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      level: '路亚达人'
    },
    content: '今天在千岛湖解锁米级翘嘴！这个窗口期抓得太准了，用的米诺，收线要慢。兄弟们，这波什么水平？🎣',
    images: [
        'https://picsum.photos/400/400?random=100',
        'https://picsum.photos/400/400?random=1002',
        'https://picsum.photos/400/400?random=1003'
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
        }
    ],
    timestamp: '2小时前',
    isLiked: false,
    isBookmarked: false,
    tags: ['路亚', '翘嘴', '巨物']
  },
  {
    id: 'vid_1',
    user: {
        id: 'user_4',
        name: '黑坑老板娘',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
        level: '塘主'
    },
    content: '今天放鱼3000斤，大青鱼为主，明天早上6点开干！想爆护的赶紧来占位！📹',
    images: [],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4', // Example video
    location: '杭州·老李垂钓园',
    likes: 245,
    comments: 56,
    timestamp: '1小时前',
    isLiked: true,
    isBookmarked: false,
    tags: ['黑坑', '放鱼视频']
  },
  {
    id: '2',
    user: {
      id: 'user_2',
      name: '老张爱台钓',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
      level: '野钓王者'
    },
    content: '这里的鲫鱼皮毛真好，黄金鲫！一下午爆护，可以回家喝汤了。',
    images: ['https://picsum.photos/400/300?random=101', 'https://picsum.photos/400/300?random=105'],
    location: '绍兴·鉴湖',
    likes: 45,
    comments: 0,
    commentsList: [],
    timestamp: '4小时前',
    isLiked: true,
    isBookmarked: true,
    tags: ['台钓', '鲫鱼', '野钓']
  },
  {
    id: '3',
    user: {
      id: 'user_3',
      name: 'FishingGirl',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      level: '新手上路'
    },
    content: '第一次夜钓，虽然只上了一条小鱼，但是感觉很棒！有没有大神教教怎么调漂呀？😅',
    images: ['https://picsum.photos/400/500?random=102'],
    location: '杭州·钱塘江',
    likes: 89,
    comments: 1,
    commentsList: [],
    timestamp: '昨天',
    isLiked: false,
    isBookmarked: false,
    tags: ['夜钓', '求助']
  }
];

const Community: React.FC<CommunityProps> = ({ onComposeClick, onUserClick, onMessageClick }) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleBookmark = (id: string) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  const handleAddComment = (postId: string, text: string) => {
      const newComment: Comment = {
          id: Date.now().toString(),
          user: {
              name: '我',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'
          },
          text: text,
          timestamp: '刚刚'
      };

      setPosts(posts.map(post => {
          if (post.id === postId) {
              return {
                  ...post,
                  comments: post.comments + 1,
                  commentsList: [...(post.commentsList || []), newComment]
              };
          }
          return post;
      }));
  };

  // Helper to render media grid
  const renderMedia = (post: Post) => {
    if (post.video) {
        return (
            <div className="rounded-xl overflow-hidden bg-black aspect-video mb-3 relative group">
                <video 
                    src={post.video} 
                    className="w-full h-full object-contain" 
                    controls 
                    preload="metadata"
                />
            </div>
        );
    }

    if (!post.images || post.images.length === 0) return null;

    const count = post.images.length;
    let gridClass = '';
    
    if (count === 1) {
        return (
            <div 
                className="rounded-xl overflow-hidden mb-3 bg-slate-100 cursor-pointer active:opacity-90 transition-opacity max-h-[400px]"
                onClick={() => setPreviewImage(post.images[0])}
            >
                <img src={post.images[0]} alt="Post" className="w-full h-full object-cover" />
            </div>
        );
    } else if (count === 2) {
        gridClass = 'grid-cols-2 aspect-[2/1]';
    } else if (count === 4) {
        gridClass = 'grid-cols-2 aspect-square';
    } else {
        gridClass = 'grid-cols-3 aspect-square'; // 3, 5-9 images
    }

    return (
        <div className={`grid ${gridClass} gap-1 mb-3 rounded-xl overflow-hidden`}>
            {post.images.slice(0, 9).map((img, idx) => (
                <div 
                    key={idx} 
                    className="relative bg-slate-100 cursor-pointer overflow-hidden aspect-square"
                    onClick={() => setPreviewImage(img)}
                >
                    <img src={img} alt={`Post ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    {count > 9 && idx === 8 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                            +{count - 9}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
  };

  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="min-h-screen bg-slate-100 pb-24 relative">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 shadow-sm flex justify-between items-center">
        <div className="flex space-x-6 text-sm font-bold">
            <span className="text-slate-900 text-lg border-b-2 border-blue-600 pb-1">推荐</span>
            <span className="text-slate-400 pb-1">同城</span>
            <span className="text-slate-400 pb-1">关注</span>
        </div>
        <div className="flex items-center space-x-3">
             <button 
                onClick={onMessageClick}
                className="bg-slate-100 p-2 rounded-full relative hover:bg-slate-200 transition-colors"
             >
                <Bell size={18} className="text-slate-600" />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
        </div>
      </div>

      {/* Feed */}
      <div className="px-3 py-4 space-y-4">
        {posts.map(post => {
            const isExpanded = expandedPosts.has(post.id);
            const MAX_LENGTH = 60;
            const shouldTruncate = post.content.length > MAX_LENGTH;
            const displayContent = isExpanded ? post.content : post.content.slice(0, MAX_LENGTH);

            return (
            <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50">
                {/* User Info */}
                <div className="flex justify-between items-center mb-3">
                    <div 
                      className="flex items-center cursor-pointer active:opacity-70 transition-opacity"
                      onClick={() => onUserClick(post.user.id)}
                    >
                        <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full bg-slate-100 object-cover" />
                        <div className="ml-3">
                            <div className="flex items-center">
                                <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">{post.user.name}</h3>
                                <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                                    {post.user.level}
                                </span>
                            </div>
                            <span className="text-xs text-slate-400">{post.timestamp}</span>
                        </div>
                    </div>
                    <button className="text-slate-400">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="text-slate-800 text-sm mb-3 leading-relaxed break-words">
                    {displayContent}
                    {!isExpanded && shouldTruncate && '...'}
                    {shouldTruncate && (
                        <span 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(post.id);
                            }}
                            className="text-blue-600 font-medium ml-1 cursor-pointer hover:underline"
                        >
                            {isExpanded ? ' 收起' : ' 全文'}
                        </span>
                    )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-blue-600 text-xs">#{tag}</span>
                    ))}
                </div>

                {/* Media Grid */}
                {renderMedia(post)}

                {/* Location & Stats */}
                <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 w-fit px-2 py-1 rounded-lg">
                    <MapPin size={12} className="mr-1 text-blue-500" />
                    {post.location}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <div className="flex space-x-6">
                        <button 
                            onClick={() => toggleLike(post.id)}
                            className="flex items-center space-x-1 group"
                        >
                            <Heart 
                                size={22} 
                                className={`transition-colors duration-200 ${
                                    post.isLiked ? 'fill-red-500 text-red-500' : 'text-slate-600 group-hover:text-red-500'
                                }`} 
                            />
                            <span className={`text-sm ${post.isLiked ? 'text-red-500' : 'text-slate-600'}`}>
                                {post.likes}
                            </span>
                        </button>
                        <button 
                            onClick={() => setActivePostId(post.id)}
                            className="flex items-center space-x-1 group"
                        >
                            <MessageCircle size={22} className="text-slate-600 group-hover:text-blue-500" />
                            <span className="text-sm text-slate-600">{post.comments}</span>
                        </button>
                        <button 
                            onClick={() => toggleBookmark(post.id)}
                            className="flex items-center space-x-1 group"
                        >
                            <Bookmark 
                                size={22} 
                                className={`transition-colors duration-200 ${
                                    post.isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600 group-hover:text-yellow-500'
                                }`} 
                            />
                        </button>
                    </div>
                    <button className="text-slate-600">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>
            );
        })}
      </div>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 rounded-full shadow-lg shadow-blue-300 active:scale-95 transition-transform z-40"
        onClick={onComposeClick}
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {/* Comments Sheet */}
      {activePost && (
          <CommentsSheet 
            post={activePost} 
            onClose={() => setActivePostId(null)} 
            onAddComment={handleAddComment}
          />
      )}

      {/* Image Preview Overlay */}
      {previewImage && (
        <ImagePreview 
          src={previewImage} 
          onClose={() => setPreviewImage(null)} 
        />
      )}
    </div>
  );
};

export default Community;
