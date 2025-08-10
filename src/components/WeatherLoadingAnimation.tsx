import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface WeatherLoadingAnimationProps {
  className?: string;
}

export const WeatherLoadingAnimation: React.FC<WeatherLoadingAnimationProps> = ({ className = '' }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center ${className}`}>
      <div className="text-center text-white relative">
        {/* 主要加载动画 */}
        <div className="relative mb-8">
          {/* 外圈旋转环 */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-r-white animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-white animate-spin" style={{animationDuration: '2s'}}></div>
            
            {/* 中心天气图标动画 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* 太阳 */}
                <div className="w-12 h-12 bg-yellow-400 rounded-full animate-pulse relative">
                  {/* 太阳光线 */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-4 bg-yellow-400 rounded-full"
                      style={{
                        top: '-1.5rem',
                        left: '50%',
                        transformOrigin: '50% 2.5rem',
                        transform: `translateX(-50%) rotate(${i * 45}deg)`,
                        animation: `sunRays 2s ease-in-out infinite ${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* 云朵 */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute -top-1 -right-4 w-6 h-6 bg-white rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.7s'}}></div>
                
                {/* 雨滴 */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`rain-${i}`}
                    className="absolute w-1 h-3 bg-blue-400 rounded-full opacity-70"
                    style={{
                      left: `${20 + i * 15}px`,
                      top: '3rem',
                      animation: `rainDrop 1.5s ease-in-out infinite ${i * 0.3}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 加载文字 */}
        <div className="space-y-4">
          <h2 className="text-3xl font-light tracking-wide animate-fade-in-out">加载天气信息中</h2>
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-white rounded-full animate-bounce"
                style={{animationDelay: `${i * 0.2}s`}}
              />
            ))}
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-white to-yellow-300 rounded-full animate-loading-progress"></div>
          </div>
        </div>
        
        {/* 浮动粒子 */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatingParticle ${3 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      

    </div>
  );
};

// 添加全局CSS动画
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sunRays {
      0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
      50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
    }
    
    @keyframes rainDrop {
      0% { opacity: 0; transform: translateY(-10px); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: translateY(20px); }
    }
    
    @keyframes fade-in-out {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    
    @keyframes loading-progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }
    
    @keyframes floatingParticle {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
      25% { transform: translateY(-20px) rotate(90deg); opacity: 0.7; }
      50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
      75% { transform: translateY(-30px) rotate(270deg); opacity: 0.5; }
    }
    
    .animate-fade-in-out {
      animation: fade-in-out 2s ease-in-out infinite;
    }
    
    .animate-loading-progress {
      animation: loading-progress 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}