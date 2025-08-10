import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, MapPin } from 'lucide-react';
import { weatherApi } from '../services/weatherApi';
import { CityResult } from '../types/weather';
import { useWeatherStore } from '../store/weatherStore';
import { useTheme } from '../hooks/useTheme';

interface SearchBoxProps {
  onCitySelect?: (city: string, adcode: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onCitySelect,
  placeholder = '搜索城市...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const { searchHistory, addSearchHistory, removeSearchHistory, clearSearchHistory } = useWeatherStore();
  const { isDark } = useTheme();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 搜索城市
  const searchCities = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const results = await weatherApi.searchCities(keyword);
      setSearchResults(results);
      setSearchError(null);
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
      if (error instanceof Error) {
        if (error.message.includes('频率超限')) {
          setSearchError(error.message);
        } else {
          setSearchError('搜索失败，请稍后重试');
        }
      } else {
        setSearchError('搜索时发生未知错误');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchCities(query);
        setShowResults(true);
        setShowHistory(false);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 选择城市
  const handleCitySelect = (city: string, adcode: string) => {
    setQuery('');
    setShowResults(false);
    setShowHistory(false);
    addSearchHistory(city, adcode);
    onCitySelect?.(city, adcode);
  };

  // 显示搜索历史
  const handleInputFocus = () => {
    if (!query && searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  // 清空输入
  const handleClearInput = () => {
    setQuery('');
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 transition-colors duration-200 ${
            isDark ? 'text-gray-400 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
          }`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-10 py-3 rounded-xl leading-5 transition-all duration-200 backdrop-blur-sm border ${
            isDark 
              ? 'bg-slate-800/80 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:placeholder-gray-300' 
              : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:placeholder-gray-400'
          } focus:outline-none`}
        />
        {query && (
          <button
            onClick={handleClearInput}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
              isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 搜索结果 */}
      {(showResults || showHistory) && (
        <div className={`absolute z-50 w-full mt-2 rounded-xl shadow-lg border max-h-80 overflow-y-auto backdrop-blur-sm ${
          isDark 
            ? 'bg-slate-800/90 border-slate-600' 
            : 'bg-white/90 border-gray-200'
        }`}>
          {/* 搜索历史 */}
          {showHistory && searchHistory.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-medium flex items-center ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Clock className="w-4 h-4 mr-1" />
                  搜索历史
                </h3>
                <button
                  onClick={clearSearchHistory}
                  className={`text-xs transition-colors duration-200 ${
                    isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  清空
                </button>
              </div>
              <div className="space-y-2">
                {searchHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group transition-colors duration-200 ${
                      isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCitySelect(item.city, item.adcode)}
                  >
                    <div className="flex items-center">
                      <MapPin className={`w-4 h-4 mr-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>{item.city}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearchHistory(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className={`w-4 h-4 transition-colors duration-200 ${
                        isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 搜索结果 */}
          {showResults && (
            <div className="p-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-4">
                  <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
                    isDark ? 'border-blue-400' : 'border-blue-500'
                  }`}></div>
                  <span className={`ml-2 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>搜索中...</span>
                </div>
              ) : searchError ? (
                <div className="text-center py-4">
                  <div className={`text-sm p-3 rounded-lg ${
                    isDark 
                      ? 'text-red-400 bg-red-900/20' 
                      : 'text-red-500 bg-red-50'
                  }`}>
                    {searchError}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h3 className={`text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>搜索结果</h3>
                  {searchResults.map((city, index) => (
                    <div
                      key={`${city.adcode}-${index}`}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCitySelect(city.name, city.adcode)}
                    >
                      <MapPin className={`w-4 h-4 mr-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>{city.name}</span>
                    </div>
                  ))}
                </div>
              ) : query ? (
                <div className="text-center py-4">
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>未找到相关城市</div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};