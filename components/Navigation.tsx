
import React from 'react';
import { Tab } from '../types';
import { Home, Camera, BookOpen, Users, User } from 'lucide-react';

interface NavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: Tab.DASHBOARD, label: '首页', icon: Home },
    { id: Tab.COMMUNITY, label: '渔圈', icon: Users },
    { id: Tab.FISH_ID, label: '识鱼', icon: Camera, isCenter: true }, // Mark as center
    { id: Tab.JOURNAL, label: '鱼护', icon: BookOpen },
    { id: Tab.MINE, label: '我的', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-1 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div className="flex justify-between items-end max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          if (item.isCenter) {
              return (
                <div key={item.id} className="relative -top-5 flex flex-col items-center justify-center w-full pointer-events-none">
                     <button
                        onClick={() => onTabChange(item.id)}
                        className={`pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-blue-200 transition-transform active:scale-95 ${
                            isActive ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 'bg-blue-500 text-white'
                        }`}
                    >
                        <Icon size={28} />
                    </button>
                    <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                        {item.label}
                    </span>
                </div>
              );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-end pb-1 space-y-1 transition-colors duration-200 w-full h-12 ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
