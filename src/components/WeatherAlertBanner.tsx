import React from 'react';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface WeatherAlert {
  id: string;
  level: 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  time: string;
}

interface WeatherAlertBannerProps {
  alerts: WeatherAlert[];
  onDismiss?: (alertId: string) => void;
}

export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = ({ alerts, onDismiss }) => {
  const { isDark } = useTheme();

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'danger':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (level: string) => {
    if (isDark) {
      switch (level) {
        case 'danger':
          return 'bg-red-900/80 border-red-700 text-red-200';
        case 'warning':
          return 'bg-yellow-900/80 border-yellow-700 text-yellow-200';
        case 'info':
        default:
          return 'bg-blue-900/80 border-blue-700 text-blue-200';
      }
    } else {
      switch (level) {
        case 'danger':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'info':
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    }
  };

  const getIconColor = (level: string) => {
    if (isDark) {
      switch (level) {
        case 'danger':
          return 'text-red-400';
        case 'warning':
          return 'text-yellow-400';
        case 'info':
        default:
          return 'text-blue-400';
      }
    } else {
      switch (level) {
        case 'danger':
          return 'text-red-600';
        case 'warning':
          return 'text-yellow-600';
        case 'info':
        default:
          return 'text-blue-600';
      }
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg border p-4 backdrop-blur-sm transition-all duration-300 animate-fade-in ${
            getAlertStyles(alert.level)
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${getIconColor(alert.level)}`}>
                {getAlertIcon(alert.level)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1">{alert.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{alert.description}</p>
                <p className="text-xs opacity-70 mt-2">{alert.time}</p>
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.id)}
                className={`flex-shrink-0 ml-3 p-1 rounded-full transition-colors duration-200 ${
                  isDark
                    ? 'hover:bg-white/10 text-gray-400 hover:text-gray-200'
                    : 'hover:bg-black/10 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// 示例用法的默认预警数据
export const sampleAlerts: WeatherAlert[] = [
  {
    id: '1',
    level: 'warning',
    title: '大风蓝色预警',
    description: '预计未来24小时内，本地区将出现6-7级大风，阵风可达8级，请注意防范。',
    time: '2024-01-15 14:30'
  },
  {
    id: '2',
    level: 'info',
    title: '天气提醒',
    description: '今日气温较低，建议增添衣物，注意保暖。',
    time: '2024-01-15 08:00'
  }
];