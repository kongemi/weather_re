import React from 'react';
import { WeatherAnimationType } from '../types/weather';
import { useTheme } from '../hooks/useTheme';

interface WeatherAnimationProps {
  type: WeatherAnimationType;
  className?: string;
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ type, className = '' }) => {
  const { isDark } = useTheme();
  
  const renderAnimation = () => {
    switch (type) {
      case 'sunny':
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* 太阳 */}
            <div className={`absolute top-6 right-6 w-24 h-24 rounded-full shadow-lg ${
              isDark ? 'bg-yellow-500 shadow-yellow-500/30' : 'bg-yellow-400 shadow-yellow-400/50'
            }`} style={{animation: 'sunPulse 2s ease-in-out infinite'}}>
              {/* 太阳光线 - 主要光线 */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1 h-12 origin-bottom rounded-full ${
                    isDark ? 'bg-yellow-400' : 'bg-yellow-300'
                  }`}
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-50px)`,
                    animation: `sunRays 2s ease-in-out infinite ${i * 0.1}s`
                  }}
                />
              ))}
              {/* 太阳光线 - 次要光线 */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`sub-${i}`}
                  className={`absolute w-0.5 h-8 origin-bottom rounded-full ${
                    isDark ? 'bg-yellow-300' : 'bg-yellow-200'
                  }`}
                  style={{
                    transform: `rotate(${i * 45 + 22.5}deg) translateY(-40px)`,
                    animation: `sunRaysSecondary 3s ease-in-out infinite ${i * 0.15}s`
                  }}
                />
              ))}
              {/* 太阳内核 */}
              <div className={`absolute inset-2 rounded-full ${
                isDark ? 'bg-yellow-400' : 'bg-yellow-300'
              }`} style={{animation: 'sunCore 1.5s ease-in-out infinite'}} />
            </div>
            {/* 闪烁的光点 */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className={`absolute w-1 h-1 rounded-full ${
                  isDark ? 'bg-yellow-300' : 'bg-yellow-200'
                }`}
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animation: `sparkle 3s ease-in-out infinite ${Math.random() * 3}s`
                }}
              />
            ))}
            {/* 背景渐变 */}
            <div className={`absolute inset-0 opacity-90 ${
              isDark 
                ? 'bg-gradient-to-b from-yellow-600 via-orange-700 to-yellow-800' 
                : 'bg-gradient-to-b from-yellow-200 via-orange-200 to-yellow-100'
            }`} />
            <div className={`absolute inset-0 ${
              isDark 
                ? 'bg-gradient-radial from-yellow-500/20 via-transparent to-transparent'
                : 'bg-gradient-radial from-yellow-300/30 via-transparent to-transparent'
            }`} />
          </div>
        );

      case 'cloudy':
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* 云朵 */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full opacity-80 ${
                  isDark ? 'bg-gray-600' : 'bg-white'
                }`}
                style={{
                  width: `${80 + i * 20}px`,
                  height: `${40 + i * 10}px`,
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 25}%`,
                  animation: `cloudMove 8s ease-in-out infinite ${i * 2}s`
                }}
              />
            ))}
            <div className={`absolute inset-0 opacity-60 ${
              isDark 
                ? 'bg-gradient-to-b from-gray-700 to-gray-800'
                : 'bg-gradient-to-b from-gray-300 to-gray-100'
            }`} />
          </div>
        );

      case 'rainy':
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* 密集雨滴 */}
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className={`absolute opacity-80 rounded-full ${
                  isDark ? 'bg-blue-300' : 'bg-blue-400'
                }`}
                style={{
                  width: `${1 + Math.random() * 2}px`,
                  height: `${8 + Math.random() * 12}px`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animation: `rainDrop ${0.8 + Math.random() * 0.4}s linear infinite`
                }}
              />
            ))}
            {/* 大雨滴 */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`heavy-${i}`}
                className={`absolute w-1 h-16 opacity-90 rounded-full ${
                  isDark ? 'bg-blue-400' : 'bg-blue-500'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animation: 'heavyRainDrop 0.6s linear infinite'
                }}
              />
            ))}
            {/* 动态云朵 */}
            <div className={`absolute top-2 left-1/4 w-36 h-18 rounded-full opacity-90 ${
              isDark ? 'bg-gray-800' : 'bg-gray-700'
            }`} style={{animation: 'cloudSway 4s ease-in-out infinite'}} />
            <div className={`absolute top-6 left-1/2 w-28 h-14 rounded-full opacity-85 ${
              isDark ? 'bg-gray-900' : 'bg-gray-800'
            }`} style={{animation: 'cloudSway 3s ease-in-out infinite 1s'}} />
            <div className={`absolute top-4 left-1/6 w-24 h-12 rounded-full opacity-80 ${
              isDark ? 'bg-gray-700' : 'bg-gray-600'
            }`} style={{animation: 'cloudSway 5s ease-in-out infinite 0.5s'}} />
            {/* 水坑和涟漪效果 */}
            <div className={`absolute bottom-0 left-0 right-0 h-6 opacity-60 ${
              isDark ? 'bg-blue-800' : 'bg-blue-300'
            }`} style={{animation: 'waterLevel 2s ease-in-out infinite'}} />
            {[...Array(8)].map((_, i) => (
              <div
                key={`ripple-${i}`}
                className={`absolute bottom-2 w-8 h-2 border rounded-full opacity-50 ${
                  isDark ? 'border-blue-300' : 'border-blue-400'
                }`}
                style={{
                  left: `${10 + i * 10}%`,
                  animation: `ripple 2s ease-out infinite ${i * 0.3}s`
                }}
              />
            ))}
            {/* 闪电效果 */}
            <div className={`absolute top-1/4 left-1/3 w-1 h-20 opacity-0 ${
              isDark ? 'bg-yellow-200' : 'bg-yellow-300'
            }`} style={{animation: 'lightning 4s ease-in-out infinite'}} />
            <div className={`absolute inset-0 opacity-50 ${
              isDark 
                ? 'bg-gradient-to-b from-gray-800 via-gray-600 to-blue-800'
                : 'bg-gradient-to-b from-gray-700 via-gray-500 to-blue-300'
            }`} />
          </div>
        );

      case 'snowy':
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* 大雪花 */}
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className={`absolute opacity-90 ${
                  isDark ? 'text-gray-100' : 'text-white'
                }`}
                style={{
                  fontSize: `${16 + Math.random() * 8}px`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animation: `snowFall ${3 + Math.random() * 2}s linear infinite`
                }}
              >
                ❄
              </div>
            ))}
            {/* 中等雪花 */}
            {[...Array(40)].map((_, i) => (
              <div
                key={`medium-${i}`}
                className={`absolute opacity-80 ${
                  isDark ? 'text-gray-200' : 'text-white'
                }`}
                style={{
                  fontSize: `${10 + Math.random() * 6}px`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animation: `snowFallMedium ${2.5 + Math.random() * 1.5}s linear infinite`
                }}
              >
                ❅
              </div>
            ))}
            {/* 小雪花 */}
            {[...Array(60)].map((_, i) => (
              <div
                key={`small-${i}`}
                className={`absolute w-1 h-1 rounded-full opacity-70 ${
                  isDark ? 'bg-gray-100' : 'bg-white'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animation: `snowFallSmall ${2 + Math.random() * 1}s linear infinite`
                }}
              />
            ))}
            {/* 积雪层次 */}
            <div className={`absolute bottom-0 left-0 right-0 h-12 opacity-95 ${
              isDark ? 'bg-gray-100' : 'bg-white'
            }`} style={{animation: 'snowAccumulate 8s ease-in-out infinite'}} />
            <div className={`absolute bottom-0 left-0 right-0 h-6 opacity-80 ${
              isDark ? 'bg-gray-200' : 'bg-blue-50'
            }`} />
            {/* 雪堆 */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`pile-${i}`}
                className={`absolute bottom-0 rounded-t-full opacity-90 ${
                  isDark ? 'bg-gray-100' : 'bg-white'
                }`}
                style={{
                  width: `${20 + Math.random() * 30}px`,
                  height: `${8 + Math.random() * 12}px`,
                  left: `${i * 15 + Math.random() * 10}%`,
                  animation: `snowPile 6s ease-in-out infinite ${i * 0.5}s`
                }}
              />
            ))}
            <div className={`absolute inset-0 opacity-70 ${
              isDark 
                ? 'bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800'
                : 'bg-gradient-to-b from-gray-200 via-blue-50 to-white'
            }`} />
          </div>
        );

      case 'windy':
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* 强风线 */}
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className={`absolute opacity-70 rounded-full ${
                  isDark ? 'bg-gray-300' : 'bg-gray-500'
                }`}
                style={{
                  width: `${40 + Math.random() * 60}px`,
                  height: `${1 + Math.random() * 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: '-80px',
                  animationDelay: `${Math.random() * 1.5}s`,
                  animation: `windMove ${1.5 + Math.random() * 0.8}s linear infinite`
                }}
              />
            ))}
            {/* 旋风效果 */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`whirl-${i}`}
                className={`absolute w-16 h-16 border-2 rounded-full opacity-40 ${
                  isDark ? 'border-gray-300' : 'border-gray-400'
                }`}
                style={{
                  top: `${20 + i * 25}%`,
                  left: `${30 + i * 20}%`,
                  animation: `whirlwind ${2 + i * 0.5}s linear infinite`
                }}
              />
            ))}
            {/* 飞舞的叶子 */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`leaf-${i}`}
                className={`absolute w-3 h-2 rounded-full opacity-80 ${
                  isDark ? 'bg-green-300' : 'bg-green-400'
                }`}
                style={{
                  top: `${Math.random() * 80}%`,
                  left: '-20px',
                  animationDelay: `${Math.random() * 3}s`,
                  animation: `leafFly ${2 + Math.random() * 2}s ease-in-out infinite`
                }}
              />
            ))}
            {/* 摇摆的树 - 增强版 */}
            <div className={`absolute bottom-0 right-12 w-6 h-32 origin-bottom ${
              isDark ? 'bg-amber-700' : 'bg-amber-800'
            }`} style={{animation: 'treeSway 1.5s ease-in-out infinite'}} />
            <div className={`absolute bottom-28 right-9 w-12 h-12 rounded-full ${
              isDark ? 'bg-green-400' : 'bg-green-500'
            }`} style={{animation: 'leavesShake 1s ease-in-out infinite'}} />
            <div className={`absolute bottom-0 left-1/4 w-4 h-20 origin-bottom ${
              isDark ? 'bg-amber-600' : 'bg-amber-700'
            }`} style={{animation: 'treeSway 1.8s ease-in-out infinite 0.3s'}} />
            <div className={`absolute bottom-16 left-1/4 w-8 h-8 rounded-full ${
              isDark ? 'bg-green-300' : 'bg-green-400'
            }`} style={{animation: 'leavesShake 1.2s ease-in-out infinite 0.3s'}} />
            {/* 移动的云朵 */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`cloud-${i}`}
                className={`absolute rounded-full opacity-60 ${
                  isDark ? 'bg-gray-300' : 'bg-white'
                }`}
                style={{
                  width: `${60 + i * 20}px`,
                  height: `${30 + i * 10}px`,
                  top: `${10 + i * 15}%`,
                  left: '-100px',
                  animationDelay: `${i * 1.5}s`,
                  animation: `cloudFly ${4 + i * 0.5}s linear infinite`
                }}
              />
            ))}
            <div className={`absolute inset-0 opacity-60 ${
              isDark 
                ? 'bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800'
                : 'bg-gradient-to-b from-blue-300 via-green-200 to-green-100'
            }`} />
          </div>
        );

      case 'foggy':
        return (
          <div className="relative w-full h-full overflow-hidden">
            {/* 雾气 */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full opacity-40 ${
                  isDark ? 'bg-gray-500' : 'bg-gray-300'
                }`}
                style={{
                  width: `${100 + i * 20}px`,
                  height: `${30 + i * 5}px`,
                  top: `${20 + i * 15}%`,
                  left: `${-10 + i * 15}%`,
                  animation: `fogMove 6s ease-in-out infinite ${i * 1}s`
                }}
              />
            ))}
            <div className={`absolute inset-0 opacity-70 ${
              isDark 
                ? 'bg-gradient-to-b from-gray-600 to-gray-800'
                : 'bg-gradient-to-b from-gray-400 to-gray-200'
            }`} />
          </div>
        );

      default:
        return (
          <div className={`absolute inset-0 opacity-50 ${
            isDark 
              ? 'bg-gradient-to-b from-gray-600 to-gray-800'
              : 'bg-gradient-to-b from-blue-300 to-blue-100'
          }`} />
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {renderAnimation()}
      
      {/* CSS动画样式 */}
      <style>{`
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 255, 0, 0.5); }
          50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(255, 255, 0, 0.8); }
        }
        
        @keyframes sunRays {
          0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(5deg); }
        }
        
        @keyframes sunRaysSecondary {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 0.7; transform: scale(1.1) rotate(-3deg); }
        }
        
        @keyframes sunCore {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes cloudMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(25px); }
        }
        
        @keyframes cloudSway {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(15px) translateY(-5px); }
          66% { transform: translateX(-10px) translateY(3px); }
        }
        
        @keyframes rainDrop {
          0% { top: -20px; opacity: 1; }
          100% { top: 100%; opacity: 0.3; }
        }
        
        @keyframes heavyRainDrop {
          0% { top: -30px; opacity: 1; transform: scaleY(1); }
          100% { top: 100%; opacity: 0; transform: scaleY(1.5); }
        }
        
        @keyframes waterLevel {
          0%, 100% { height: 24px; }
          50% { height: 32px; }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        
        @keyframes lightning {
          0%, 95%, 100% { opacity: 0; }
          96%, 98% { opacity: 1; }
        }
        
        @keyframes snowFall {
          0% { top: -20px; transform: translateX(0) rotate(0deg); }
          100% { top: 100%; transform: translateX(30px) rotate(360deg); }
        }
        
        @keyframes snowFallMedium {
          0% { top: -15px; transform: translateX(0) rotate(0deg); }
          100% { top: 100%; transform: translateX(20px) rotate(180deg); }
        }
        
        @keyframes snowFallSmall {
          0% { top: -10px; transform: translateX(0); }
          100% { top: 100%; transform: translateX(15px); }
        }
        
        @keyframes snowAccumulate {
          0%, 100% { height: 48px; }
          50% { height: 52px; }
        }
        
        @keyframes snowPile {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes windMove {
          0% { left: -80px; opacity: 0; transform: scaleX(0.5); }
          20% { opacity: 1; transform: scaleX(1); }
          80% { opacity: 1; transform: scaleX(1.2); }
          100% { left: 100%; opacity: 0; transform: scaleX(0.8); }
        }
        
        @keyframes whirlwind {
          0% { transform: rotate(0deg) scale(0.5); opacity: 0.2; }
          50% { opacity: 0.6; }
          100% { transform: rotate(360deg) scale(1.2); opacity: 0.1; }
        }
        
        @keyframes leafFly {
          0% { left: -20px; transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(10px) rotate(180deg); }
          75% { transform: translateY(-10px) rotate(270deg); }
          100% { left: 100%; transform: translateY(0) rotate(360deg); }
        }
        
        @keyframes treeSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        
        @keyframes leavesShake {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(3deg); }
          75% { transform: scale(0.95) rotate(-3deg); }
        }
        
        @keyframes cloudFly {
          0% { left: -100px; }
          100% { left: 100%; }
        }
        
        @keyframes fogMove {
          0%, 100% { transform: translateX(0) scale(1); opacity: 0.3; }
          50% { transform: translateX(40px) scale(1.2); opacity: 0.7; }
        }
        
        .animate-sway {
          animation: sway 2s ease-in-out infinite;
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
      `}</style>
    </div>
  );
};

// 根据天气描述获取动画类型
export const getWeatherAnimationType = (weather: string): WeatherAnimationType => {
  const weatherLower = weather.toLowerCase();
  
  if (weatherLower.includes('晴') || weatherLower.includes('sunny')) {
    return 'sunny';
  } else if (weatherLower.includes('雨') || weatherLower.includes('rain')) {
    return 'rainy';
  } else if (weatherLower.includes('雪') || weatherLower.includes('snow')) {
    return 'snowy';
  } else if (weatherLower.includes('风') || weatherLower.includes('wind')) {
    return 'windy';
  } else if (weatherLower.includes('雾') || weatherLower.includes('fog')) {
    return 'foggy';
  } else if (weatherLower.includes('云') || weatherLower.includes('cloud')) {
    return 'cloudy';
  } else {
    return 'cloudy';
  }
};