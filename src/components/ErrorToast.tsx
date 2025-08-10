import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';

export const ErrorToast: React.FC = () => {
  const { error, setError } = useWeatherStore();

  // 自动关闭错误提示
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 8000); // 8秒后自动关闭

      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              请求失败
            </h3>
            <div className="mt-1 text-sm text-red-700">
              {error}
            </div>
            {error.includes('频率超限') && (
              <div className="mt-2 text-xs text-red-600">
                建议：等待几分钟后再试，或使用缓存的数据
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => setError(null)}
              className="inline-flex text-red-400 hover:text-red-600 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};