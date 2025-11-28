
import React, { useEffect, useState } from 'react';
import { WeatherData, FishingSpot } from '../types';
import { 
  Wind, Droplets, Gauge, MapPin, 
  Sun, ChevronRight, Waves, MessageSquare,
  Cloud, CloudRain, Umbrella
} from 'lucide-react';
import { fetchLocalWeather } from '../services/weatherService';

const mockSpots: FishingSpot[] = [
    {
        id: '1',
        name: '青山湖路亚基地 No.1',
        image: 'https://picsum.photos/100/100?random=1',
        distance: '5.2 km',
        tags: ['路亚', '水深2-5m'],
        rating: 4.8,
        price: '',
        address: '',
        features: [],
        fishSpecies: [],
        description: ''
    },
    {
        id: '2',
        name: '西湖野钓区',
        image: 'https://picsum.photos/100/100?random=2',
        distance: '8.4 km',
        tags: ['台钓', '免费'],
        rating: 4.5,
        price: '',
        address: '',
        features: [],
        fishSpecies: [],
        description: ''
    },
    {
        id: '3',
        name: '千岛湖巨物塘',
        image: 'https://picsum.photos/100/100?random=3',
        distance: '120 km',
        tags: ['巨物', '度假'],
        rating: 4.9,
        price: '',
        address: '',
        features: [],
        fishSpecies: [],
        description: ''
    }
];

// Helper Component for List Item
interface ListItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub: string;
    iconColor: string;
}

const ListItem: React.FC<ListItemProps> = ({ icon, label, value, sub, iconColor }) => (
    <div className="flex items-center justify-between p-3.5 group active:bg-slate-50 transition-colors cursor-pointer">
        <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                {icon}
            </div>
            <div className="ml-3">
                <div className="text-sm font-medium text-slate-700">{label}</div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-sm font-bold text-slate-900">{value}</div>
            <div className="text-[10px] text-slate-400">{sub}</div>
        </div>
    </div>
);

// Helper for Weather Icons
const getWeatherIcon = (condition: string, size: number = 20) => {
    if (condition.includes('雨')) return <CloudRain size={size} className="text-blue-500" />;
    if (condition.includes('云') || condition.includes('阴')) return <Cloud size={size} className="text-slate-500" />;
    return <Sun size={size} className="text-orange-500" />;
};

interface DashboardProps {
    onAssistantClick?: () => void;
    onSpotClick: (spotId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAssistantClick, onSpotClick }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            // In a real app, we would get coordinates here first
            const data = await fetchLocalWeather();
            setWeather(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  if (loading || !weather) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <span className="text-slate-400 text-sm">正在获取当地鱼情...</span>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-5 pb-24 bg-slate-50 min-h-screen relative">
      {/* Header Compact */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-5 pb-10 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Waves size={120} />
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start">
                <div className="flex items-center text-blue-100 text-xs bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                    <MapPin size={12} className="mr-1" />
                    <span>{weather.locationName || '未知位置'}</span>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold tracking-tight">{weather.temp}°</div>
                    <div className="text-xs text-blue-100 font-medium opacity-90">{weather.condition}</div>
                </div>
            </div>
            
            <div className="mt-6">
                 <div className="flex items-baseline">
                    <h1 className="text-xl font-bold mr-2">钓鱼指数: 8.5</h1>
                    <span className="text-xs font-medium bg-white/20 px-1.5 py-0.5 rounded text-white">高</span>
                 </div>
                 <p className="text-xs text-blue-100 mt-1 opacity-80">气压稳定，鱼口活跃，适宜下竿</p>
            </div>
        </div>
      </div>

      {/* Dense List Container - Negative Margin to pull up */}
      <div className="px-3 -mt-6 relative z-20 space-y-4">
        
        {/* Environment Stats List */}
        <div>
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
              <ListItem 
                icon={<Wind size={16} />} 
                label="风速风向" 
                value={`${weather.windSpeed} m/s`} 
                sub="微风" 
                iconColor="text-blue-500 bg-blue-50"
              />
              <ListItem 
                icon={<Gauge size={16} />} 
                label="大气压" 
                value={`${weather.pressure} hPa`} 
                sub="走势平稳" 
                iconColor="text-purple-500 bg-purple-50"
              />
              <ListItem 
                icon={<Droplets size={16} />} 
                label="相对湿度" 
                value={`${weather.humidity}%`} 
                sub="体感舒适" 
                iconColor="text-cyan-500 bg-cyan-50"
              />
           </div>
        </div>

        {/* 3-Day Forecast Card */}
        {weather.dailyForecast && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center">
                        <Sun size={16} className="mr-2 text-orange-500" />
                        未来三天预报
                    </h3>
                </div>
                <div className="flex justify-between divide-x divide-slate-50">
                    {weather.dailyForecast.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center px-1">
                            <span className="text-xs text-slate-500 mb-2">{day.date}</span>
                            <div className="mb-2">
                                {getWeatherIcon(day.condition)}
                            </div>
                            <span className="text-sm font-bold text-slate-800 mb-1">
                                {day.tempMin}° / {day.tempMax}°
                            </span>
                            <div className="flex items-center text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                                <Umbrella size={10} className="mr-1" />
                                {day.precipProb}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Spots List Compact */}
        <div>
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">热门钓点</h3>
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                {mockSpots.map((spot) => (
                    <div 
                        key={spot.id} 
                        onClick={() => onSpotClick(spot.id)}
                        className="p-3 flex items-center active:bg-slate-50 transition-colors cursor-pointer group"
                    >
                        <img 
                           src={spot.image} 
                           alt={spot.name} 
                           className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{spot.name}</h4>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap pt-0.5">{spot.distance}</span>
                            </div>
                            <div className="flex items-center mt-1 space-x-2">
                                 {spot.tags.map((tag, i) => (
                                     <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">{tag}</span>
                                 ))}
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 ml-2 flex-shrink-0 group-hover:text-slate-400 transition-colors" />
                    </div>
                ))}
                <div className="p-3 text-center text-xs text-blue-600 font-medium active:bg-slate-50 cursor-pointer">
                    查看更多周边钓点
                </div>
            </div>
        </div>
      </div>
      
      {/* Floating AI Assistant Button */}
      {onAssistantClick && (
          <button 
            onClick={onAssistantClick}
            className="fixed bottom-24 right-4 bg-white p-3 rounded-full shadow-lg shadow-blue-100 border border-blue-50 z-30 flex items-center justify-center active:scale-90 transition-transform"
          >
             <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full p-2">
                 <MessageSquare size={20} className="text-white" />
             </div>
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
             </span>
          </button>
      )}
    </div>
  );
};

export default Dashboard;
