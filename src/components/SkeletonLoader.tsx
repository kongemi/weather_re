import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'weather-card' | 'mini-card';
  lines?: number;
  width?: string;
  height?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'text',
  lines = 1,
  width,
  height
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'rounded-xl h-32';
      case 'circle':
        return 'rounded-full w-12 h-12';
      case 'weather-card':
        return 'rounded-2xl h-64';
      case 'mini-card':
        return 'rounded-xl h-24 min-w-[120px]';
      default:
        return 'rounded h-4';
    }
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || undefined,
    animation: 'shimmer 2s infinite'
  };

  if (variant === 'weather-card') {
    return (
      <div className={`${baseClasses} ${getVariantClasses()} ${className} relative overflow-hidden`} style={style}>
        {/* 模拟天气卡片内容 */}
        <div className="absolute inset-0 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-6 bg-white/20 rounded w-24"></div>
              <div className="h-4 bg-white/20 rounded w-16"></div>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-white/20 rounded w-32"></div>
            <div className="h-6 bg-white/20 rounded w-20"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-white/20 rounded w-16"></div>
            <div className="h-4 bg-white/20 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'mini-card') {
    return (
      <div className={`${baseClasses} ${getVariantClasses()} ${className} relative overflow-hidden`} style={style}>
        <div className="absolute inset-0 p-4 space-y-2 text-center">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-12 mx-auto"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-10 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

// 预设的骨架屏组合
export const WeatherCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <SkeletonLoader variant="weather-card" className={className} />
);

export const MiniCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <SkeletonLoader variant="mini-card" className={className} />
);

export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className }) => (
  <SkeletonLoader variant="text" lines={lines} className={className} />
);