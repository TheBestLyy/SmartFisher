
import { WeatherData, DailyForecast } from '../types';

// Helper to get day name
const getDayName = (offset: number) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const date = new Date();
    date.setDate(date.getDate() + offset);
    if (offset === 0) return '今天';
    if (offset === 1) return '明天';
    return days[date.getDay()];
};

// Simulated API call
export const fetchLocalWeather = async (): Promise<WeatherData> => {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            // Mock data generation logic
            const baseTemp = 20 + Math.random() * 5;
            
            const forecast: DailyForecast[] = [
                {
                    date: getDayName(1),
                    condition: '多云',
                    tempMin: Math.floor(baseTemp - 5),
                    tempMax: Math.floor(baseTemp + 2),
                    precipProb: 15
                },
                {
                    date: getDayName(2),
                    condition: '小雨',
                    tempMin: Math.floor(baseTemp - 6),
                    tempMax: Math.floor(baseTemp - 1),
                    precipProb: 80
                },
                {
                    date: getDayName(3),
                    condition: '晴',
                    tempMin: Math.floor(baseTemp - 4),
                    tempMax: Math.floor(baseTemp + 4),
                    precipProb: 0
                }
            ];

            resolve({
                temp: Math.floor(baseTemp),
                condition: '多云转阴',
                pressure: 1012 + Math.floor(Math.random() * 10),
                windSpeed: Number((2 + Math.random() * 3).toFixed(1)),
                humidity: 60 + Math.floor(Math.random() * 20),
                locationName: '杭州市 · 余杭区', // Mock location
                dailyForecast: forecast
            });
        }, 1000);
    });
};

export const getUserLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};
