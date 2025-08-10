import React from 'react';
import { Database } from 'lucide-react';

interface CacheIndicatorProps {
  isFromCache?: boolean;
  className?: string;
}

export const CacheIndicator: React.FC<CacheIndicatorProps> = ({
  isFromCache = false,
  className = ''
}) => {
  if (!isFromCache) return null;

  return (
    <div className={`inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full ${className}`}>
      <Database className="w-3 h-3 mr-1" />
      <span>缓存数据</span>
    </div>
  );
};