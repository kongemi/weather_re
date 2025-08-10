import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Clock, Trash2 } from 'lucide-react';
import { SearchBox } from '../components/SearchBox';
import { useWeatherStore } from '../store/weatherStore';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchHistory, removeSearchHistory, clearSearchHistory, popularCities } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState('');

  // 处理城市选择
  const handleCitySelect = (city: string, adcode: string) => {
    navigate(`/weather/${encodeURIComponent(city)}`);
  };

  // 处理热门城市点击
  const handlePopularCityClick = (city: string) => {
    navigate(`/weather/${encodeURIComponent(city)}`);
  };

  // 处理历史记录点击
  const handleHistoryClick = (city: string) => {
    navigate(`/weather/${encodeURIComponent(city)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">搜索城市</h1>
        </div>
        
        {/* 搜索框 */}
        <div className="px-4 pb-4">
          <SearchBox 
            onCitySelect={handleCitySelect}
            placeholder="输入城市名称搜索..."
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 搜索历史 */}
        {searchHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                搜索历史
              </h2>
              <button
                onClick={clearSearchHistory}
                className="text-sm text-red-500 hover:text-red-700 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                清空
              </button>
            </div>
            
            <div className="space-y-2">
              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                  onClick={() => handleHistoryClick(item.city)}
                >
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-800">{item.city}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(item.searchTime).toLocaleDateString('zh-CN', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearchHistory(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 热门城市 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-gray-500" />
            热门城市
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularCities.map((city) => (
              <button
                key={city.adcode}
                onClick={() => handlePopularCityClick(city.name)}
                className="p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 group-hover:text-blue-500" />
                  <span className="font-medium text-gray-800 group-hover:text-blue-600">
                    {city.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 搜索提示 */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">搜索提示</h3>
          <div className="text-sm text-blue-600 space-y-1">
            <div>• 支持输入完整城市名称，如"北京市"、"上海市"</div>
            <div>• 支持输入城市简称，如"北京"、"上海"</div>
            <div>• 支持搜索区县，如"朝阳区"、"浦东新区"</div>
            <div>• 搜索历史会自动保存，方便快速查看</div>
          </div>
        </div>

        {/* 空状态 */}
        {searchHistory.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">开始搜索城市</h3>
            <p className="text-gray-400">在上方搜索框输入城市名称，获取实时天气信息</p>
          </div>
        )}
      </div>
    </div>
  );
};