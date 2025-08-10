import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Thermometer, Droplets, Wind, Eye, Gauge, Sun, Moon, Calendar } from 'lucide-react';
import { WeatherAnimation, getWeatherAnimationType } from '../components/WeatherAnimation';
import { WeatherAlert } from '../components/WeatherAlert';
import { WeatherDetailAnimations, TemperatureWave, DataPulse, FloatingCard } from '../components/WeatherDetailAnimations';
import { WeatherLoadingAnimation } from '../components/WeatherLoadingAnimation';
import { useWeatherStore } from '../store/weatherStore';
import { WeatherForecast } from '../types/weather';
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle } from '../components/ThemeToggle';

export const WeatherDetail: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const {
    currentWeather,
    liveWeather,
    weatherAlerts,
    loading,
    fetchWeatherByCity,
    fetchLiveWeather,
    fetchWeatherAlerts
  } = useWeatherStore();

  const [showAlerts, setShowAlerts] = useState(true);

  // 解码城市名称
  const cityName = city ? decodeURIComponent(city) : '北京市';

  useEffect(() => {
    if (cityName) {
      fetchWeatherByCity(cityName);
      fetchLiveWeather(cityName);
      fetchWeatherAlerts('110000');
    }
  }, [cityName]);

  // 获取当前天气信息
  const currentCast = currentWeather?.casts?.[0];
  const temperature = liveWeather?.temperature || currentCast?.daytemp || '25';
  const weatherDesc = liveWeather?.weather || currentCast?.dayweather || '晴';
  const animationType = getWeatherAnimationType(weatherDesc);

  // 获取背景渐变
  const getBackgroundGradient = (weather: string) => {
    const weatherLower = weather.toLowerCase();
    
    if (weatherLower.includes('晴')) {
      return 'from-orange-400 via-yellow-400 to-yellow-300';
    } else if (weatherLower.includes('雨')) {
      return 'from-blue-600 via-blue-500 to-blue-400';
    } else if (weatherLower.includes('雪')) {
      return 'from-blue-200 via-white to-gray-100';
    } else if (weatherLower.includes('风')) {
      return 'from-gray-400 via-gray-300 to-blue-200';
    } else {
      return 'from-blue-400 via-blue-300 to-blue-200';
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '明天';
    } else {
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
  };

  // 获取星期
  const getWeekDay = (weekNumber: string) => {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekIndex = parseInt(weekNumber);
    
    // 检查weekIndex是否有效
    if (isNaN(weekIndex) || weekIndex < 0 || weekIndex > 6) {
      return '周一'; // 默认返回周一
    }
    
    return `周${weekDays[weekIndex]}`;
  };

  if (loading) {
    return <WeatherLoadingAnimation />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} animate-fade-in`} style={{animation: 'pageEnter 0.8s ease-out'}}>
      {/* 动态天气背景 */}
      <div className="relative h-screen overflow-hidden">
        {/* 背景动画 */}
        <div className="absolute inset-0">
          <WeatherAnimation type={animationType} />
        </div>
        
        {/* 新增粒子动画 */}
        <WeatherDetailAnimations 
          weatherType={weatherDesc}
          temperature={parseInt(temperature)}
          humidity={parseInt(liveWeather?.humidity || '50')}
          className="z-5"
        />
        
        {/* 背景渐变 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient(weatherDesc)} opacity-85`} />
        
        {/* 毛玻璃效果层 */}
        <div className="absolute inset-0 backdrop-blur-sm" />
        
        {/* 内容层 */}
        <div className="relative z-10 h-full flex flex-col">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between p-6 text-white animate-slide-down" style={{animation: 'slideDown 0.6s ease-out 0.2s both'}}>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl px-5 py-3 hover:bg-opacity-30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-1"
            >
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="font-medium">返回</span>
            </button>
            <h1 className="text-2xl font-bold tracking-wide drop-shadow-lg animate-pulse">{cityName}</h1>
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-2 shadow-lg hover:rotate-12 transition-transform duration-300">
              <ThemeToggle />
            </div>
          </div>

          {/* 预警信息 */}
          {weatherAlerts.length > 0 && showAlerts && (
            <div className="mx-6 mb-6" style={{animation: 'slideInLeft 0.8s ease-out 0.4s both'}}>
              <div className="bg-red-500 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300">
                <WeatherAlert 
                  alerts={weatherAlerts}
                  onClose={() => setShowAlerts(false)}
                />
              </div>
            </div>
          )}

          {/* 主要天气信息 */}
          <div className="flex-1 flex flex-col justify-center items-center text-white px-6">
            <FloatingCard className="text-center mb-12 animate-fade-in-up" style={{animation: 'fadeInScale 1s ease-out 0.6s both'}}>
              <div className="relative hover:scale-105 transition-transform duration-500">
                <div className="text-9xl md:text-[10rem] font-extralight mb-6 drop-shadow-2xl tracking-tighter relative z-10 hover:text-yellow-200 transition-colors duration-300">
                  {temperature}°
                </div>
                <TemperatureWave 
                  temperature={parseInt(temperature)} 
                  className="absolute inset-0 rounded-3xl"
                />
              </div>
              <div className="text-3xl md:text-4xl mb-4 font-light tracking-wide drop-shadow-lg shimmer-effect hover:scale-110 transition-transform duration-300">
                {weatherDesc}
              </div>
              <div className="text-xl opacity-90 font-light">
                {currentCast && (
                  <span className="bg-white bg-opacity-20 backdrop-blur-md rounded-full px-4 py-2 shimmer-effect hover:bg-opacity-30 hover:scale-105 transition-all duration-300">
                    {currentCast.nighttemp}° / {currentCast.daytemp}°
                  </span>
                )}
              </div>
            </FloatingCard>

            {/* 实时数据 */}
            {liveWeather && (
              <div className="grid grid-cols-2 gap-6 w-full max-w-md animate-fade-in-up" style={{animationDelay: '0.2s', animation: 'slideInLeft 0.8s ease-out 0.8s both'}}>
                <FloatingCard delay={0.1} className="bg-white bg-opacity-25 backdrop-blur-md rounded-2xl p-5 text-center shadow-xl hover:shadow-2xl hover:bg-opacity-35 hover:scale-105 transition-all duration-300 group">
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <Droplets className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg z-10 group-hover:animate-bounce group-hover:text-blue-200 transition-colors duration-300" />
                    <DataPulse 
                      value={parseInt(liveWeather.humidity)} 
                      maxValue={100} 
                      color="#3b82f6"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="text-sm opacity-90 mb-1 font-medium group-hover:opacity-100 transition-opacity duration-300">湿度</div>
                  <div className="text-xl font-bold group-hover:text-blue-200 transition-colors duration-300">{liveWeather.humidity}%</div>
                </FloatingCard>
                <FloatingCard delay={0.2} className="bg-white bg-opacity-25 backdrop-blur-md rounded-2xl p-5 text-center shadow-xl hover:shadow-2xl hover:bg-opacity-35 hover:scale-105 transition-all duration-300 group">
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <Wind className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg z-10 group-hover:animate-pulse group-hover:translate-x-2 group-hover:text-green-200 transition-all duration-300" />
                    <DataPulse 
                      value={parseInt(liveWeather.windpower)} 
                      maxValue={12} 
                      color="#6b7280"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="text-sm opacity-90 mb-1 font-medium group-hover:opacity-100 transition-opacity duration-300">风力</div>
                  <div className="text-xl font-bold group-hover:text-green-200 transition-colors duration-300">{liveWeather.windpower}级</div>
                </FloatingCard>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 详细信息区域 */}
      <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl shadow-2xl relative z-20`} style={{marginTop: '-2rem'}}>
        {/* 详细数据 */}
        {liveWeather && (
          <div className="p-8" style={{animation: 'slideInUp 0.8s ease-out 1s both'}}>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-8 flex items-center hover:text-blue-500 transition-colors duration-300`}>
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4 hover:animate-pulse"></div>
              详细信息
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <FloatingCard delay={0.1} className={`${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-white to-gray-50'} rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border ${isDark ? 'border-gray-600' : 'border-gray-100'} shimmer-effect`}>
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-full p-3 w-fit mx-auto relative z-10">
                    <Thermometer className="w-8 h-8 text-white" />
                  </div>
                  <TemperatureWave 
                    temperature={parseInt(liveWeather.temperature_float)} 
                    className="absolute inset-0 rounded-full"
                  />
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>体感温度</div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{liveWeather.temperature_float}°C</div>
              </FloatingCard>
              <FloatingCard delay={0.2} className={`${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-white to-gray-50'} rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border ${isDark ? 'border-gray-600' : 'border-gray-100'} shimmer-effect`}>
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-3 w-fit mx-auto relative z-10">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  <DataPulse 
                    value={parseInt(liveWeather.humidity_float)} 
                    maxValue={100} 
                    color="#3b82f6"
                    className="absolute inset-0 rounded-full"
                  />
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>相对湿度</div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{liveWeather.humidity_float}%</div>
              </FloatingCard>
              <FloatingCard delay={0.3} className={`${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-white to-gray-50'} rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border ${isDark ? 'border-gray-600' : 'border-gray-100'} shimmer-effect`}>
                <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-full p-3 w-fit mx-auto mb-4">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>风向</div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{liveWeather.winddirection}</div>
              </FloatingCard>
              <FloatingCard delay={0.4} className={`${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-white to-gray-50'} rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border ${isDark ? 'border-gray-600' : 'border-gray-100'} shimmer-effect`}>
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-3 w-fit mx-auto relative z-10">
                    <Gauge className="w-8 h-8 text-white" />
                  </div>
                  <DataPulse 
                    value={parseInt(liveWeather.windpower)} 
                    maxValue={12} 
                    color="#8b5cf6"
                    className="absolute inset-0 rounded-full"
                  />
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2 font-medium`}>风力等级</div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{liveWeather.windpower}级</div>
              </FloatingCard>
            </div>
          </div>
        )}

        {/* 未来天气预报 */}
        {currentWeather?.casts && (
          <div className={`p-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`} style={{animation: 'slideInUp 0.8s ease-out 1.2s both'}}>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-8 flex items-center hover:text-green-500 transition-colors duration-300`}>
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-4 hover:animate-pulse"></div>
              <Calendar className="w-7 h-7 mr-3 hover:animate-bounce" />
              未来天气
            </h2>
            <div className="space-y-4">
              {currentWeather.casts.map((cast, index) => (
                <FloatingCard key={index} delay={index * 0.1} className={`group flex items-center justify-between p-6 ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600' : 'bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white'} rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border ${isDark ? 'border-gray-600' : 'border-gray-100'} shimmer-effect`} style={{animation: `fadeInScale 0.6s ease-out ${1.6 + index * 0.1}s both`}}>
                  <div className="flex items-center space-x-6">
                    <div className="text-center min-w-[80px]">
                      {(() => {
                        const dateText = formatDate(cast.date);
                        const isSpecialDate = dateText === '今天' || dateText === '明天';
                        return (
                          <>
                            <div className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'} ${isSpecialDate ? 'text-blue-500' : ''}`}>{dateText}</div>
                            {!isSpecialDate && (
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>{getWeekDay(cast.week)}</div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2">
                        <Sun className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{cast.dayweather}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{cast.daytemp}°</div>
                      <div className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>{cast.nighttemp}°</div>
                    </div>
                    <div className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} min-w-[100px] text-right font-medium`}>
                      <div className="flex items-center justify-end space-x-2">
                        <Wind className="w-4 h-4" />
                        <span>{cast.daywind} {cast.daypower}级</span>
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              ))}
            </div>
          </div>
        )}

        {/* 更新时间 */}
        {currentWeather && (
          <div className={`p-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} text-center`} style={{animation: 'fadeIn 0.8s ease-out 1.4s both'}}>
            <div className={`inline-flex items-center space-x-2 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-full px-6 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium hover:scale-105 transition-transform duration-300`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>数据更新时间: {new Date(currentWeather.reporttime).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};