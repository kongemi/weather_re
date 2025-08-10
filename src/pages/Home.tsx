import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, TrendingUp, Settings } from 'lucide-react';
import { SearchBox } from '../components/SearchBox';
import { WeatherCard, WeatherCardMini } from '../components/WeatherCard';
import { WeatherAlertBanner } from '../components/WeatherAlert';
import { ThemeToggle } from '../components/ThemeToggle';
import { WeatherCardSkeleton, MiniCardSkeleton } from '../components/SkeletonLoader';
import { useWeatherStore } from '../store/weatherStore';
import { useTheme } from '../hooks/useTheme';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const {
    currentWeather,
    liveWeather,
    selectedCity,
    popularCities,
    weatherAlerts,
    loading,
    fetchWeatherByCity,
    fetchLiveWeather,
    fetchWeatherAlerts
  } = useWeatherStore();

  const [popularCitiesWeather, setPopularCitiesWeather] = useState<{[key: string]: {temp: string, weather: string}}>({});

  // 初始化加载默认城市天气
  useEffect(() => {
    fetchWeatherByCity(selectedCity);
    fetchLiveWeather(selectedCity);
    fetchWeatherAlerts('110000');
  }, []);

  // 模拟加载热门城市天气数据
  useEffect(() => {
    const loadPopularCitiesWeather = () => {
      const mockWeatherData: {[key: string]: {temp: string, weather: string}} = {
        '北京市': { temp: '25', weather: '晴' },
        '上海市': { temp: '28', weather: '多云' },
        '广州市': { temp: '32', weather: '小雨' },
        '深圳市': { temp: '30', weather: '晴' },
        '杭州市': { temp: '26', weather: '多云' },
        '成都市': { temp: '24', weather: '阴' },
        '西安市': { temp: '22', weather: '晴' },
        '武汉市': { temp: '27', weather: '小雨' }
      };
      setPopularCitiesWeather(mockWeatherData);
    };

    loadPopularCitiesWeather();
  }, []);

  // 处理城市搜索选择
  const handleCitySelect = (city: string, adcode: string) => {
    fetchWeatherByCity(city);
    fetchLiveWeather(city);
    fetchWeatherAlerts(adcode);
  };

  // 处理热门城市点击
  const handlePopularCityClick = (city: string) => {
    fetchWeatherByCity(city);
    fetchLiveWeather(city);
    navigate(`/weather/${encodeURIComponent(city)}`);
  };

  // 处理天气卡片点击
  const handleWeatherCardClick = () => {
    navigate(`/weather/${encodeURIComponent(selectedCity)}`);
  };

  // 处理预警点击
  const handleAlertClick = () => {
    navigate(`/weather/${encodeURIComponent(selectedCity)}`);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100'
    }`}>
      {/* 预警横幅 */}
      {weatherAlerts.length > 0 && (
        <WeatherAlertBanner 
          alert={weatherAlerts[0]} 
          onClick={handleAlertClick}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              天气预报
            </h1>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
          <p className={`${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            实时天气信息，精准预报服务
          </p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-md mx-auto mb-8">
          <SearchBox 
            onCitySelect={handleCitySelect}
            placeholder="搜索城市获取天气信息..."
          />
        </div>

        {/* 当前天气卡片 */}
        <div className="max-w-lg mx-auto mb-12 animate-scale-in">
          {loading ? (
            <WeatherCardSkeleton className="h-64" />
          ) : (
            <WeatherCard 
              weather={currentWeather}
              liveWeather={liveWeather}
              onClick={handleWeatherCardClick}
              className="h-64 hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* 热门城市 */}
        <div className="mb-8 animate-slide-in-left">
          <div className="flex items-center mb-6">
            <TrendingUp className={`w-6 h-6 mr-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`} />
            <h2 className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>热门城市</h2>
          </div>
          
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4 min-w-max">
              {loading ? (
                // 骨架屏
                Array.from({ length: 6 }).map((_, index) => (
                  <MiniCardSkeleton key={index} />
                ))
              ) : (
                popularCities.map((city, index) => {
                  const cityWeather = popularCitiesWeather[city.name];
                  return (
                    <div 
                      key={city.adcode}
                      className="animate-slide-in-right"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <WeatherCardMini
                        city={city.name}
                        temperature={cityWeather?.temp}
                        weather={cityWeather?.weather}
                        onClick={() => handlePopularCityClick(city.name)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="max-w-2xl mx-auto animate-fade-in">

        </div>
      </div>
     </div>
   );
 };