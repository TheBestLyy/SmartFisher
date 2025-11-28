
import React from 'react';
import { 
    ChevronLeft, Share2, MapPin, Navigation, Phone, 
    Star, Car, Coffee, Moon, Anchor, Info 
} from 'lucide-react';
import { FishingSpot } from '../types';

interface FishingSpotDetailProps {
  spotId: string;
  onBack: () => void;
}

// Mock Data Fetcher
const getMockSpot = (id: string): FishingSpot => {
    // In a real app, fetch from API
    return {
        id,
        name: id === '1' ? '青山湖路亚基地 No.1' : (id === '2' ? '西湖野钓区' : '千岛湖巨物塘'),
        image: `https://picsum.photos/800/600?random=${id}`,
        distance: '5.2 km',
        tags: ['路亚', '黑坑', '巨物'],
        rating: 4.8,
        price: '¥100/4小时',
        address: '杭州市临安区青山湖科技城环湖绿道入口处向西200米',
        features: ['免费停车', '可夜钓', '提供餐饮', '渔具租赁'],
        fishSpecies: ['大口黑鲈', '翘嘴', '鳜鱼', '鳡鱼'],
        description: '青山湖路亚基地环境优美，水质清澈。主攻路亚对象鱼，近期放流大口黑鲈2000斤，翘嘴500斤。标点丰富，结构复杂，适合各种路亚钓法。'
    };
};

const FishingSpotDetail: React.FC<FishingSpotDetailProps> = ({ spotId, onBack }) => {
  const spot = getMockSpot(spotId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-safe">
      {/* Hero Image */}
      <div className="relative h-64 w-full">
        <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white z-10">
            <button 
                onClick={onBack}
                className="bg-black/30 p-2 rounded-full backdrop-blur-sm active:scale-95 transition-transform"
            >
                <ChevronLeft size={24} />
            </button>
            <button className="bg-black/30 p-2 rounded-full backdrop-blur-sm active:scale-95 transition-transform">
                <Share2 size={24} />
            </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
             <div className="flex items-center space-x-2 mb-2">
                 {spot.tags.map(tag => (
                     <span key={tag} className="text-[10px] bg-blue-600/80 backdrop-blur-md px-2 py-0.5 rounded font-medium">
                         {tag}
                     </span>
                 ))}
             </div>
             <h1 className="text-2xl font-bold text-shadow">{spot.name}</h1>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 -mt-4 relative z-10 bg-slate-50 rounded-t-3xl overflow-hidden px-4 pt-6 space-y-4 pb-24">
         
         {/* Basic Info Card */}
         <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
             <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-3">
                 <div className="flex items-center text-orange-500 font-bold">
                     <span className="text-2xl mr-1">{spot.rating}</span>
                     <div className="flex">
                         {[1,2,3,4,5].map(i => (
                             <Star key={i} size={12} fill="currentColor" className={i <= Math.round(spot.rating) ? 'text-orange-500' : 'text-slate-200'} />
                         ))}
                     </div>
                     <span className="text-xs text-slate-400 ml-2 font-normal">500+ 人去过</span>
                 </div>
                 <div className="text-right">
                     <span className="text-lg font-bold text-red-500">{spot.price}</span>
                 </div>
             </div>
             
             <div className="flex items-start justify-between">
                 <div className="flex items-start text-slate-600 text-sm leading-relaxed pr-4">
                     <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-slate-400" />
                     {spot.address}
                 </div>
                 <div className="flex flex-col items-center justify-center pl-4 border-l border-slate-100 flex-shrink-0 min-w-[60px]">
                     <Navigation size={24} className="text-blue-600 mb-1" />
                     <span className="text-[10px] text-slate-500">{spot.distance}</span>
                 </div>
             </div>
         </div>

         {/* Features Grid */}
         <div className="grid grid-cols-4 gap-2">
             {spot.features.map((feat, idx) => (
                 <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                     {feat.includes('停车') && <Car size={20} className="text-blue-500 mb-1" />}
                     {feat.includes('夜钓') && <Moon size={20} className="text-purple-500 mb-1" />}
                     {feat.includes('餐饮') && <Coffee size={20} className="text-orange-500 mb-1" />}
                     {feat.includes('渔具') && <Anchor size={20} className="text-cyan-500 mb-1" />}
                     <span className="text-[10px] text-slate-600">{feat}</span>
                 </div>
             ))}
         </div>

         {/* Fish Species */}
         <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                 <Info size={18} className="mr-2 text-blue-600" /> 主要鱼种
             </h3>
             <div className="flex flex-wrap gap-2">
                 {spot.fishSpecies.map(fish => (
                     <span key={fish} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
                         {fish}
                     </span>
                 ))}
             </div>
         </div>

         {/* Description */}
         <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-3">钓场简介</h3>
             <p className="text-sm text-slate-600 leading-relaxed text-justify">
                 {spot.description}
             </p>
         </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-50 flex items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center px-4 cursor-pointer active:opacity-60">
              <Phone size={20} className="text-slate-600 mb-1" />
              <span className="text-[10px] text-slate-500">电话</span>
          </div>
          <button 
             className="flex-1 ml-4 bg-blue-600 text-white py-3 rounded-full font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center"
             onClick={() => alert("即将打开地图导航...")}
          >
              <Navigation size={18} className="mr-2" />
              立即导航
          </button>
      </div>
    </div>
  );
};

export default FishingSpotDetail;
