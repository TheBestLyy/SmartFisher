
import React, { useState } from 'react';
import { 
    ChevronLeft, MapPin, MessageSquare, UserPlus, Check, Heart, 
    MoreHorizontal, Settings, Edit, Bookmark, Clock, FileText, Anchor, X, History, FileEdit, ShoppingBag
} from 'lucide-react';
import { Post, UserProfile as UserProfileType } from '../types';
import EditProfile from './EditProfile';

interface UserProfileProps {
  userId: string;
  onBack: () => void;
  onPostClick?: (postId: string) => void;
  onUserClick?: (userId: string) => void;
  onChatClick?: (userId: string) => void;
}

// --- Types & Mock Data for User Lists ---

interface SimpleUser {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    isFollowing: boolean;
    isMutal?: boolean; // 互相关注
}

const mockFollowers: SimpleUser[] = [
    { id: 'u2', name: '台钓小王子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prince', bio: '一支竿走天下', isFollowing: true, isMutal: true },
    { id: 'u3', name: '空军司令', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Commander', bio: '除了鱼钓不到，其他都能钓上来', isFollowing: false },
    { id: 'u4', name: 'Suki', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suki', bio: '喜欢路亚的萌新', isFollowing: false },
    { id: 'u5', name: '大鱼杀手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Killer', bio: '专注巨物', isFollowing: true, isMutal: true },
    { id: 'u6', name: '周末钓手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Weekend', bio: '平时上班，周末河边见', isFollowing: false },
];

const mockFollowing: SimpleUser[] = [
    { id: 'u1', name: '路亚阿强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', bio: '专注路亚10年', isFollowing: true },
    { id: 'u2', name: '台钓小王子', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prince', bio: '一支竿走天下', isFollowing: true, isMutal: true },
    { id: 'u5', name: '大鱼杀手', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Killer', bio: '专注巨物', isFollowing: true, isMutal: true },
];

const mockSavedPosts: Post[] = [
    {
        id: '101',
        user: { id: 'user_2', name: '老张爱台钓', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', level: '野钓王者' },
        content: '冬季鲫鱼饵料配方：蓝鲫50% + 九一八40% + 速攻10%，加少量拉丝粉。',
        images: ['https://picsum.photos/400/300?random=301'],
        location: '经验分享',
        likes: 230,
        comments: 45,
        commentsList: [],
        timestamp: '3天前',
        isLiked: false,
        isBookmarked: true,
        tags: ['饵料', '鲫鱼']
    },
    {
        id: '1',
        user: { id: 'user_1', name: '路亚阿强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', level: '路亚达人' },
        content: '千岛湖标点分享，这个湾子结构很好，巨物出没！',
        images: ['https://picsum.photos/400/400?random=100'],
        location: '杭州·千岛湖',
        likes: 128,
        comments: 2,
        commentsList: [],
        timestamp: '2小时前',
        isLiked: false,
        isBookmarked: true,
        tags: ['路亚', '标点']
    }
];

const mockHistoryPosts: Post[] = [
    {
        id: '201',
        user: { id: 'user_3', name: '海钓大叔', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sea', level: '海钓专家' },
        content: '昨晚舟山夜钓，这几条黑鲷很漂亮。',
        images: ['https://picsum.photos/400/300?random=201'],
        location: '舟山',
        likes: 56,
        comments: 12,
        timestamp: '昨天',
        isLiked: false,
        isBookmarked: false,
        tags: ['海钓', '黑鲷']
    },
    ...mockSavedPosts // Just for demo, reuse saved posts as history
];

// --- Sub-Component: User List Overlay ---

interface UserListOverlayProps {
    title: string;
    users: SimpleUser[];
    onClose: () => void;
    onUserClick?: (userId: string) => void;
}

const UserListOverlay: React.FC<UserListOverlayProps> = ({ title, users, onClose, onUserClick }) => {
    const [list, setList] = useState(users);

    const toggleFollow = (id: string) => {
        setList(prev => prev.map(u => {
            if (u.id === id) {
                return { ...u, isFollowing: !u.isFollowing };
            }
            return u;
        }));
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 animate-in slide-in-from-right duration-200 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-3 shadow-sm border-b border-slate-100 flex items-center sticky top-0 z-10">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-lg font-bold text-slate-900 ml-2">{title}</h2>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {list.map(user => (
                    <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <div 
                            className="flex items-center flex-1 min-w-0 mr-3 cursor-pointer active:opacity-60"
                            onClick={() => {
                                onClose(); // Close overlay first
                                if(onUserClick) onUserClick(user.id);
                            }}
                        >
                            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0" />
                            <div className="ml-3 min-w-0">
                                <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
                                <p className="text-xs text-slate-500 truncate mt-0.5">{user.bio}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleFollow(user.id)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                                user.isFollowing
                                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                                    : 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                            }`}
                        >
                            {user.isFollowing ? (user.isMutal ? '互相关注' : '已关注') : '关注'}
                        </button>
                    </div>
                ))}
                {list.length === 0 && (
                    <div className="text-center text-slate-400 py-10 text-sm">
                        暂无用户
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Sub-Component: Post List Overlay (Generic for Saved & History) ---

interface PostListOverlayProps {
    title: string;
    posts: Post[];
    onClose: () => void;
    onPostClick?: (postId: string) => void;
}

const PostListOverlay: React.FC<PostListOverlayProps> = ({ title, posts, onClose, onPostClick }) => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-50 animate-in slide-in-from-right duration-200 flex flex-col">
             {/* Header */}
            <div className="bg-white px-4 py-3 shadow-sm border-b border-slate-100 flex items-center sticky top-0 z-10">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-lg font-bold text-slate-900 ml-2">{title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {posts.map(post => {
                    const thumb = post.images?.[0] || post.video || '';
                    return (
                    <div 
                        key={post.id} 
                        onClick={() => onPostClick && onPostClick(post.id)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex h-28 active:scale-[0.99] transition-transform cursor-pointer"
                    >
                        <div className="w-28 h-full flex-shrink-0 bg-slate-100 relative">
                             {post.video ? (
                                <video src={post.video} className="w-full h-full object-cover" />
                             ) : (
                                <img src={thumb} className="w-full h-full object-cover" alt="Post" />
                             )}
                        </div>
                        <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                            <div>
                                <h3 className="text-sm text-slate-800 line-clamp-2 font-medium mb-1">{post.content}</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] text-slate-500 flex items-center">
                                        @{post.user.name}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span className="bg-slate-50 px-1.5 py-0.5 rounded text-[10px]">#{post.tags[0] || '动态'}</span>
                                <div className="flex items-center space-x-3">
                                    <span className="flex items-center text-red-400"><Heart size={10} className="mr-0.5 fill-current"/> {post.likes}</span>
                                    <span className="flex items-center text-yellow-500"><Bookmark size={10} className="mr-0.5 fill-current"/></span>
                                </div>
                            </div>
                        </div>
                    </div>
                 );
                 })}
                 {posts.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-20 text-slate-400">
                        <Bookmark size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">暂无内容</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main UserProfile Component ---

const getMockUserProfile = (id: string): UserProfileType => {
  const isMe = id === 'me';
  return {
    id,
    name: isMe ? '我的昵称' : (id === 'user_1' ? '路亚阿强' : (id === 'u2' ? '台钓小王子' : '钓鱼佬')),
    avatar: isMe 
        ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'
        : (id === 'user_1' 
            ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' 
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`),
    level: isMe ? '钓鱼新手' : '路亚大师',
    bio: isMe 
        ? '点击编辑简介，让更多钓友认识你...' 
        : '专注路亚10年，目标是游钓全中国。喜欢分享标点和技巧，欢迎交流！🎣',
    bgImage: 'https://picsum.photos/800/400?grayscale&blur=2',
    stats: {
      likes: isMe ? 5 : 1205,
      following: isMe ? 3 : 45,
      followers: isMe ? 5 : 3880
    },
    isFollowing: false
  };
};

const mockUserPosts: Post[] = [
  {
    id: '101',
    user: { id: 'user_1', name: '路亚阿强', avatar: '', level: '' },
    content: '今天这尾鲈鱼手感炸裂！',
    images: ['https://picsum.photos/400/400?random=201'],
    location: '杭州·青山湖',
    likes: 88,
    comments: 12,
    timestamp: '2天前',
    isLiked: true,
    isBookmarked: false,
    tags: ['路亚', '鲈鱼']
  },
  {
    id: '102',
    user: { id: 'user_1', name: '路亚阿强', avatar: '', level: '' },
    content: '空军是不可能空军的，这辈子都不可能空军。',
    images: ['https://picsum.photos/400/500?random=202'],
    location: '杭州·钱塘江',
    likes: 45,
    comments: 5,
    timestamp: '1周前',
    isLiked: false,
    isBookmarked: false,
    tags: ['野钓']
  }
];

const UserProfile: React.FC<UserProfileProps> = ({ userId, onBack, onPostClick, onUserClick, onChatClick }) => {
  const [profile, setProfile] = useState<UserProfileType>(getMockUserProfile(userId));
  const isOwner = userId === 'me';
  
  // State for List Modals
  const [activeListType, setActiveListType] = useState<'followers' | 'following' | null>(null);
  const [showSavedPosts, setShowSavedPosts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update profile when userId changes
  React.useEffect(() => {
      setProfile(getMockUserProfile(userId));
  }, [userId]);

  const toggleFollow = () => {
    setProfile(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      stats: {
        ...prev.stats,
        followers: prev.isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1
      }
    }));
  };

  const handleUpdateProfile = (updatedData: Partial<UserProfileType>) => {
      setProfile(prev => ({
          ...prev,
          ...updatedData
      }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative pb-20">
      {/* Header Image & Nav */}
      <div className="h-48 relative w-full overflow-hidden">
        <img src={profile.bgImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Top Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white z-10">
           {!isOwner ? (
                <button onClick={onBack} className="bg-black/30 p-2 rounded-full backdrop-blur-sm active:scale-95 transition-transform">
                    <ChevronLeft size={24} />
                </button>
           ) : (
               <div></div> // Spacer
           )}
           
           {isOwner ? (
               <button className="bg-black/30 p-2 rounded-full backdrop-blur-sm">
                   <Settings size={24} />
               </button>
           ) : (
                <button className="bg-black/30 p-2 rounded-full backdrop-blur-sm">
                    <MoreHorizontal size={24} />
                </button>
           )}
        </div>
      </div>

      {/* Profile Info Card - Overlapping */}
      <div className="px-4 -mt-12 relative z-10">
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 pb-6">
            <div className="flex justify-between items-start">
               <div className="relative">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 -mt-10"
                  />
                  <div className="absolute bottom-0 right-0 bg-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white text-yellow-900">
                    LV.8
                  </div>
               </div>
               
               <div className="flex space-x-2 mt-1">
                  {isOwner ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 rounded-full text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200 active:bg-slate-200"
                      >
                          <Edit size={16} className="mr-1" /> 编辑资料
                      </button>
                  ) : (
                      <>
                        <button 
                            onClick={() => onChatClick && onChatClick(userId)}
                            className="p-2 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 active:scale-95 transition-transform"
                        >
                            <MessageSquare size={20} />
                        </button>
                        <button 
                            onClick={toggleFollow}
                            className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                                profile.isFollowing 
                                ? 'bg-slate-100 text-slate-600 border border-slate-200' 
                                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                            }`}
                        >
                            {profile.isFollowing ? (
                                <>
                                <Check size={16} className="mr-1" /> 已关注
                                </>
                            ) : (
                                <>
                                <UserPlus size={16} className="mr-1" /> 关注
                                </>
                            )}
                        </button>
                      </>
                  )}
               </div>
            </div>

            <div className="mt-3">
               <h1 className="text-xl font-bold text-slate-900 flex items-center">
                  {profile.name}
                  <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                     {profile.level}
                  </span>
               </h1>
               <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  {profile.bio}
               </p>
            </div>

            {/* Stats */}
            <div className="flex justify-around mt-6 border-t border-slate-50 pt-4">
                <div 
                    className="text-center cursor-pointer active:opacity-60 transition-opacity"
                    onClick={() => setActiveListType('following')}
                >
                    <div className="font-bold text-slate-900 text-lg">{profile.stats.following}</div>
                    <div className="text-xs text-slate-400">关注</div>
                </div>
                <div 
                    className="text-center cursor-pointer active:opacity-60 transition-opacity"
                    onClick={() => setActiveListType('followers')}
                >
                    <div className="font-bold text-slate-900 text-lg">{profile.stats.followers}</div>
                    <div className="text-xs text-slate-400">粉丝</div>
                </div>
                <div className="text-center">
                    <div className="font-bold text-slate-900 text-lg">{profile.stats.likes}</div>
                    <div className="text-xs text-slate-400">获赞</div>
                </div>
            </div>
         </div>
         
         {/* Owner Function Grid */}
         {isOwner && (
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">我的服务</h3>
                <div className="grid grid-cols-4 gap-4">
                     <div 
                        className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                        onClick={() => setShowSavedPosts(true)}
                     >
                         <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-2 text-yellow-500">
                             <Bookmark size={20} />
                         </div>
                         <span className="text-xs text-slate-600">我的收藏</span>
                     </div>
                     <div 
                        className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                        onClick={() => setShowHistory(true)}
                     >
                         <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-2 text-blue-500">
                             <History size={20} />
                         </div>
                         <span className="text-xs text-slate-600">浏览历史</span>
                     </div>
                     <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform">
                         <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-2 text-purple-500">
                             <FileEdit size={20} />
                         </div>
                         <span className="text-xs text-slate-600">草稿箱</span>
                     </div>
                     <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform">
                         <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-2 text-emerald-500">
                             <ShoppingBag size={20} />
                         </div>
                         <span className="text-xs text-slate-600">我的装备</span>
                     </div>
                </div>
            </div>
         )}

         {/* Posts Feed */}
         <div className="mt-6">
            <div className="flex items-center space-x-6 border-b border-slate-200 mb-4 px-2">
                <button className="pb-2 border-b-2 border-slate-900 font-bold text-slate-900">
                    动态 ({isOwner ? 2 : 23})
                </button>
                <button className="pb-2 border-b-2 border-transparent text-slate-400 font-medium">
                    图集
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
               {mockUserPosts.map(post => (
                   <div 
                        key={post.id} 
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer"
                        onClick={() => onPostClick && onPostClick(post.id)}
                   >
                       {post.video ? (
                           <div className="relative aspect-[4/5] bg-black">
                               <video src={post.video} className="w-full h-full object-cover" />
                           </div>
                       ) : (
                           <img src={post.images[0]} alt="Post" className="w-full aspect-[4/5] object-cover" />
                       )}
                       
                       <div className="p-3">
                           <p className="text-sm text-slate-900 line-clamp-2 mb-2 font-medium">{post.content}</p>
                           <div className="flex justify-between items-center text-xs text-slate-400">
                               <span>{post.timestamp}</span>
                               <div className="flex items-center text-red-400">
                                   <Heart size={10} className="mr-0.5 fill-current" />
                                   {post.likes}
                               </div>
                           </div>
                       </div>
                   </div>
               ))}
            </div>
         </div>
      </div>

      {/* Conditional Overlays */}
      {activeListType && (
          <UserListOverlay 
            title={activeListType === 'following' ? '我的关注' : '我的粉丝'} 
            users={activeListType === 'following' ? mockFollowing : mockFollowers}
            onClose={() => setActiveListType(null)}
            onUserClick={onUserClick}
          />
      )}

      {showSavedPosts && (
          <PostListOverlay 
            title="我的收藏"
            posts={mockSavedPosts} 
            onClose={() => setShowSavedPosts(false)} 
            onPostClick={onPostClick}
          />
      )}

      {showHistory && (
          <PostListOverlay 
            title="浏览历史"
            posts={mockHistoryPosts} 
            onClose={() => setShowHistory(false)} 
            onPostClick={onPostClick}
          />
      )}

      {isEditing && (
          <EditProfile 
             profile={profile} 
             onClose={() => setIsEditing(false)} 
             onSave={handleUpdateProfile} 
          />
      )}

    </div>
  );
};

export default UserProfile;
