
export interface WeatherData {
  temp: number;
  condition: string;
  pressure: number;
  windSpeed: number;
  humidity: number;
  locationName?: string; // Add location name
  dailyForecast?: DailyForecast[]; // Add forecast
}

export interface DailyForecast {
  date: string; // e.g. "明天", "周三"
  condition: string; // e.g. "Cloudy", "Rain"
  tempMin: number;
  tempMax: number;
  precipProb: number; // Percentage 0-100
}

export interface TidePoint {
  time: string;
  height: number;
}

export interface CatchLog {
  id: string;
  species: string;
  weight: number; // kg
  length: number; // cm
  location: string;
  date: string;
  note: string;
  image?: string;
}

export interface FishAnalysisResult {
  name: string;
  scientificName: string;
  edibility: string;
  description: string;
  isProtected: boolean;
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: string;
  bio: string;
  bgImage: string;
  stats: {
    likes: number;
    following: number;
    followers: number;
  };
  isFollowing: boolean;
}

export interface Post {
  id: string;
  user: {
    id: string; // Add ID to link to profile
    name: string;
    avatar: string;
    level: string; 
  };
  content: string;
  images: string[]; // Changed from image: string to string[]
  video?: string;   // Added video support
  location: string;
  likes: number;
  comments: number;
  commentsList?: Comment[];
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean; // Added for bookmark functionality
  tags: string[];
}

export interface FishingSpot {
  id: string;
  name: string;
  image: string;
  distance: string;
  tags: string[];
  rating: number;
  price: string;
  address: string;
  features: string[];
  fishSpecies: string[];
  description: string;
}

export interface ChatSummary {
    userId: string;
    userName: string;
    userAvatar: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  FISH_ID = 'FISH_ID',
  COMMUNITY = 'COMMUNITY',
  JOURNAL = 'JOURNAL',
  ASSISTANT = 'ASSISTANT',
  CREATE_POST = 'CREATE_POST',
  PROFILE = 'PROFILE',
  MINE = 'MINE',
  SPOT_DETAIL = 'SPOT_DETAIL',
  POST_DETAIL = 'POST_DETAIL',
  CHAT = 'CHAT',
  MESSAGE_LIST = 'MESSAGE_LIST'
}