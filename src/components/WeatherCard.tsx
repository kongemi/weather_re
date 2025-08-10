import React from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Eye } from 'lucide-react';
import { WeatherAnimation, getWeatherAnimationType } from './WeatherAnimation';
import { WeatherData, LiveWeather } from '../types/weather';
import { useTheme } from '../hooks/useTheme';

interface WeatherCardProps {
  weather?: WeatherData;
  liveWeather?: LiveWeather;
  className?: string;
  showAnimation?: boolean;
  onClick?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  liveWeather,
  className = '',
  showAnimation = true,
  onClick
}) => {
  const { isDark } = useTheme();
  
  // 获取当前天气信息
  const currentWeather = weather?.casts?.[0];
  const temperature = liveWeather?.temperature || currentWeather?.daytemp || '25';
  const weatherDesc = liveWeather?.weather || currentWeather?.dayweather || '晴';
  const cityName = weather?.city || liveWeather?.city || '北京市';
  
  // 获取天气图标
  const getWeatherIcon = (weather: string) => {
    const weatherLower = weather.toLowerCase();
    
    if (weatherLower.includes('晴') || weatherLower.includes('sunny')) {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    } else if (weatherLower.includes('雨') || weatherLower.includes('rain')) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    } else if (weatherLower.includes('雪') || weatherLower.includes('snow')) {
      return <Snowflake className="w-8 h-8 text-blue-200" />;
    } else if (weatherLower.includes('风') || weatherLower.includes('wind')) {
      return <Wind className="w-8 h-8 text-gray-500" />;
    } else if (weatherLower.includes('雾') || weatherLower.includes('fog')) {
      return <Eye className="w-8 h-8 text-gray-400" />;
    } else {
      return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  // 获取背景渐变色
  const getBackgroundGradient = (weather: string) => {
    const weatherLower = weather.toLowerCase();
    
    if (weatherLower.includes('晴')) {
      return isDark 
        ? 'from-orange-600 via-yellow-600 to-amber-700'
        : 'from-orange-400 via-yellow-400 to-yellow-300';
    } else if (weatherLower.includes('雨')) {
      return isDark 
        ? 'from-blue-800 via-blue-700 to-slate-800'
        : 'from-blue-600 via-blue-500 to-blue-400';
    } else if (weatherLower.includes('雪')) {
      return isDark 
        ? 'from-slate-600 via-slate-500 to-blue-800'
        : 'from-blue-200 via-white to-gray-100';
    } else if (weatherLower.includes('风')) {
      return isDark 
        ? 'from-gray-700 via-slate-600 to-blue-800'
        : 'from-gray-400 via-gray-300 to-blue-200';
    } else if (weatherLower.includes('雾')) {
      return isDark 
        ? 'from-gray-800 via-slate-700 to-slate-800'
        : 'from-gray-500 via-gray-400 to-gray-300';
    } else {
      return isDark 
        ? 'from-blue-800 via-slate-700 to-slate-800'
        : 'from-blue-400 via-blue-300 to-blue-200';
    }
  };

  const animationType = getWeatherAnimationType(weatherDesc);
  const backgroundGradient = getBackgroundGradient(weatherDesc);

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 group ${
        isDark 
          ? 'shadow-2xl shadow-slate-900/50 hover:shadow-slate-900/70' 
          : 'shadow-lg hover:shadow-xl'
      } ${className}`}
      onClick={onClick}
    >
      {/* 背景动画 */}
      {showAnimation && (
        <div className="absolute inset-0">
          <WeatherAnimation type={animationType} />
        </div>
      )}
      
      {/* 背景渐变 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient} ${
        isDark ? 'opacity-90' : 'opacity-80'
      }`} />
      
      {/* 毛玻璃效果层 */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />
      
      {/* 内容层 */}
      <div className="relative z-10 p-6 text-white">
        {/* 城市名称 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold truncate drop-shadow-sm">{cityName}</h2>
          <div className="transform group-hover:scale-110 transition-transform duration-300">
            {getWeatherIcon(weatherDesc)}
          </div>
        </div>
        
        {/* 温度 */}
        <div className="mb-2">
          <span className="text-4xl font-bold drop-shadow-lg">{temperature}</span>
          <span className="text-2xl ml-1 drop-shadow-sm">°C</span>
        </div>
        
        {/* 天气描述 */}
        <div className="text-lg opacity-90 mb-4 drop-shadow-sm">{weatherDesc}</div>
        
        {/* 额外信息 */}
        {liveWeather && (
          <div className="flex justify-between text-sm opacity-80 drop-shadow-sm">
            <span>湿度 {liveWeather.humidity}%</span>
            <span>{liveWeather.winddirection}风 {liveWeather.windpower}级</span>
          </div>
        )}
        
        {currentWeather && (
          <div className="flex justify-between text-sm opacity-80 drop-shadow-sm">
            <span>最低 {currentWeather.nighttemp}°C</span>
            <span>最高 {currentWeather.daytemp}°C</span>
          </div>
        )}
      </div>
      
      {/* 装饰性元素 */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping" />
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-white rounded-full opacity-40" />
      <div className="absolute top-6 right-6 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse" />
      
      {/* 边框光效 */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/30 transition-colors duration-300" />
    </div>
  );
};

// 小型天气卡片（用于热门城市列表）
export const WeatherCardMini: React.FC<{
  city: string;
  temperature?: string;
  weather?: string;
  onClick?: () => void;
}> = ({ city, temperature = '25', weather = '晴', onClick }) => {
  const { isDark } = useTheme();
  
  const getWeatherIcon = (weather: string) => {
    const weatherLower = weather.toLowerCase();
    
    if (weatherLower.includes('晴')) {
      return <Sun className="w-5 h-5 text-yellow-500" />;
    } else if (weatherLower.includes('雨')) {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    } else if (weatherLower.includes('雪')) {
      return <Snowflake className="w-5 h-5 text-blue-200" />;
    } else if (weatherLower.includes('风')) {
      return <Wind className="w-5 h-5 text-gray-500" />;
    } else {
      return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div 
      className={`rounded-xl p-4 transition-all duration-300 cursor-pointer min-w-[120px] flex-shrink-0 group hover:scale-105 backdrop-blur-sm border ${
        isDark 
          ? 'bg-slate-800/80 border-slate-600 shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-900/70 hover:bg-slate-700/80' 
          : 'bg-white/80 border-white/20 shadow-md hover:shadow-lg hover:bg-white/90'
      }`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="flex justify-center mb-2 transform group-hover:scale-110 transition-transform duration-300">
          {getWeatherIcon(weather)}
        </div>
        <div className={`text-lg font-bold ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>{temperature}°</div>
        <div className={`text-sm truncate ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>{city}</div>
        <div className={`text-xs mt-1 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>{weather}</div>
      </div>
      
      {/* 装饰性光点 */}
      <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
    </div>
  );
};