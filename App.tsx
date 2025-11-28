
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import FishIdentifier from './components/FishIdentifier';
import Journal from './components/Journal';
import Assistant from './components/Assistant';
import Community from './components/Community';
import CreatePost from './components/CreatePost';
import UserProfile from './components/UserProfile';
import FishingSpotDetail from './components/FishingSpotDetail';
import PostDetail from './components/PostDetail';
import ChatInterface from './components/ChatInterface';
import MessageList from './components/MessageList';
import { Tab } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.DASHBOARD);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [chattingUserId, setChattingUserId] = useState<string | null>(null);

  const handlePostCreated = () => {
    // In a real app, this would refresh the community feed
    alert("发布成功！");
    setCurrentTab(Tab.COMMUNITY);
  };

  const handleUserClick = (userId: string) => {
    setViewingUserId(userId);
    setCurrentTab(Tab.PROFILE);
  };

  const handleChatClick = (userId: string) => {
    setChattingUserId(userId);
    setCurrentTab(Tab.CHAT);
  };

  const handleSpotClick = (spotId: string) => {
    setSelectedSpotId(spotId);
    setCurrentTab(Tab.SPOT_DETAIL);
  };

  const handlePostClick = (postId: string) => {
      setSelectedPostId(postId);
      setCurrentTab(Tab.POST_DETAIL);
  };

  const renderContent = () => {
    switch (currentTab) {
      case Tab.DASHBOARD:
        return (
            <Dashboard 
                onAssistantClick={() => setCurrentTab(Tab.ASSISTANT)} 
                onSpotClick={handleSpotClick}
            />
        );
      case Tab.FISH_ID:
        return <FishIdentifier />;
      case Tab.COMMUNITY:
        return (
          <Community 
            onComposeClick={() => setCurrentTab(Tab.CREATE_POST)} 
            onUserClick={handleUserClick}
            onMessageClick={() => setCurrentTab(Tab.MESSAGE_LIST)}
          />
        );
      case Tab.JOURNAL:
        return <Journal />;
      case Tab.ASSISTANT:
        // Assistant now needs a back button since it's not on the main nav
        return <Assistant onBack={() => setCurrentTab(Tab.DASHBOARD)} />;
      case Tab.CREATE_POST:
        return <CreatePost onBack={() => setCurrentTab(Tab.COMMUNITY)} onPost={handlePostCreated} />;
      case Tab.PROFILE:
        return (
          <UserProfile 
            userId={viewingUserId || 'user_1'} 
            onBack={() => setCurrentTab(Tab.COMMUNITY)} 
            onPostClick={handlePostClick}
            onUserClick={handleUserClick}
            onChatClick={handleChatClick}
          />
        );
      case Tab.MINE:
        return (
           <UserProfile 
             userId="me" 
             onBack={() => setCurrentTab(Tab.DASHBOARD)} // Fallback, though standard nav handles this
             onPostClick={handlePostClick}
             onUserClick={handleUserClick}
           />
        );
      case Tab.SPOT_DETAIL:
        return (
            <FishingSpotDetail 
                spotId={selectedSpotId || '1'} 
                onBack={() => setCurrentTab(Tab.DASHBOARD)} 
            />
        );
      case Tab.POST_DETAIL:
        return (
            <PostDetail
                postId={selectedPostId || '1'}
                onBack={() => setCurrentTab(Tab.MINE)} // Or navigate back appropriately
            />
        );
      case Tab.MESSAGE_LIST:
        return (
            <MessageList 
                onBack={() => setCurrentTab(Tab.COMMUNITY)}
                onChatClick={handleChatClick}
            />
        );
      case Tab.CHAT:
        return (
            <ChatInterface 
                userId={chattingUserId || 'user_1'} 
                onBack={() => setCurrentTab(Tab.MESSAGE_LIST)} 
            />
        );
      default:
        return <Dashboard onSpotClick={handleSpotClick} />;
    }
  };

  // Determine if navigation should be visible
  const showNav = 
    currentTab !== Tab.CREATE_POST && 
    currentTab !== Tab.PROFILE && 
    currentTab !== Tab.ASSISTANT &&
    currentTab !== Tab.SPOT_DETAIL &&
    currentTab !== Tab.POST_DETAIL &&
    currentTab !== Tab.CHAT &&
    currentTab !== Tab.MESSAGE_LIST;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        {renderContent()}
        
        {/* Navigation Bar */}
        {showNav && (
          <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
        )}
      </main>
    </div>
  );
};

export default App;
