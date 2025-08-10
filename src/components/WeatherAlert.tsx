import React from 'react';
import { AlertTriangle, X, Clock, MapPin, Shield } from 'lucide-react';
import { WeatherAlert as WeatherAlertType } from '../types/weather';

interface WeatherAlertProps {
  alerts: WeatherAlertType[];
  onClose?: () => void;
  className?: string;
}

export const WeatherAlert: React.FC<WeatherAlertProps> = ({
  alerts,
  onClose,
  className = ''
}) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  // 获取预警等级颜色
  const getAlertColor = (level: WeatherAlertType['level']) => {
    switch (level) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-500',
          text: 'text-blue-700',
          bgLight: 'bg-blue-50'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-500',
          border: 'border-yellow-500',
          text: 'text-yellow-700',
          bgLight: 'bg-yellow-50'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500',
          border: 'border-orange-500',
          text: 'text-orange-700',
          bgLight: 'bg-orange-50'
        };
      case 'red':
        return {
          bg: 'bg-red-500',
          border: 'border-red-500',
          text: 'text-red-700',
          bgLight: 'bg-red-50'
        };
      case 'black':
        return {
          bg: 'bg-gray-800',
          border: 'border-gray-800',
          text: 'text-gray-800',
          bgLight: 'bg-gray-50'
        };
      default:
        return {
          bg: 'bg-gray-500',
          border: 'border-gray-500',
          text: 'text-gray-700',
          bgLight: 'bg-gray-50'
        };
    }
  };

  // 获取预警等级文字
  const getAlertLevelText = (level: WeatherAlertType['level']) => {
    switch (level) {
      case 'blue': return '蓝色预警';
      case 'yellow': return '黄色预警';
      case 'orange': return '橙色预警';
      case 'red': return '红色预警';
      case 'black': return '黑色预警';
      default: return '预警';
    }
  };

  // 格式化时间
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const highestAlert = alerts.reduce((prev, current) => {
    const levels = ['blue', 'yellow', 'orange', 'red', 'black'];
    return levels.indexOf(current.level) > levels.indexOf(prev.level) ? current : prev;
  });

  const colors = getAlertColor(highestAlert.level);

  return (
    <div className={`${className}`}>
      {/* 预警横幅 */}
      <div className={`${colors.bg} text-white p-3 rounded-t-lg flex items-center justify-between animate-pulse`}>
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 animate-bounce" />
          <span className="font-medium">
            {getAlertLevelText(highestAlert.level)} - {highestAlert.type}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 预警详情 */}
      <div className={`${colors.bgLight} border-l-4 ${colors.border} p-4 rounded-b-lg`}>
        {alerts.map((alert, index) => (
          <div key={index} className={`${index > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}`}>
            {/* 预警标题 */}
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold ${colors.text}`}>
                {alert.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} text-white`}>
                {getAlertLevelText(alert.level)}
              </span>
            </div>

            {/* 预警内容 */}
            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
              {alert.content}
            </p>

            {/* 时间信息 */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>发布: {formatTime(alert.publishTime)}</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                <span>生效: {formatTime(alert.effectiveTime)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span>失效: {formatTime(alert.expireTime)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 预警动画效果 */}
      <style>{`
        @keyframes alertPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes alertBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
        
        .animate-alert-pulse {
          animation: alertPulse 2s ease-in-out infinite;
        }
        
        .animate-alert-blink {
          animation: alertBlink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// 预警条幅组件（用于主页顶部显示）
export const WeatherAlertBanner: React.FC<{
  alert: WeatherAlertType;
  onClick?: () => void;
}> = ({ alert, onClick }) => {
  const colors = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    black: 'bg-gray-800'
  };

  return (
    <div 
      className={`${colors[alert.level]} text-white p-2 cursor-pointer hover:opacity-90 transition-opacity`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 mr-2 animate-bounce" />
        <span className="text-sm font-medium truncate">
          {alert.type}预警 - {alert.title}
        </span>
      </div>
    </div>
  );
};