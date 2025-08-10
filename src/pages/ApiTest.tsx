import React, { useState } from 'react';
import { weatherApi } from '../services/weatherApi';

export const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCitySearch = async () => {
    setIsLoading(true);
    addLog('开始测试城市搜索API...');
    
    try {
      const results = await weatherApi.searchCities('南阳');
      addLog(`城市搜索结果: ${JSON.stringify(results, null, 2)}`);
    } catch (error) {
      addLog(`城市搜索错误: ${error}`);
    }
    
    setIsLoading(false);
  };

  const testWeatherData = async () => {
    setIsLoading(true);
    addLog('开始测试天气数据API...');
    
    try {
      const weather = await weatherApi.getWeatherByCity('南阳市');
      addLog(`天气数据结果: ${JSON.stringify(weather, null, 2)}`);
      
      const liveWeather = await weatherApi.getLiveWeather('南阳市');
      addLog(`实时天气结果: ${JSON.stringify(liveWeather, null, 2)}`);
    } catch (error) {
      addLog(`天气数据错误: ${error}`);
    }
    
    setIsLoading(false);
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试控制</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={testCitySearch}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              测试城市搜索
            </button>
            <button
              onClick={testWeatherData}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              测试天气数据
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              清空日志
            </button>
          </div>
          {isLoading && (
            <div className="text-blue-600">正在测试API...</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">测试结果</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500">点击上方按钮开始测试...</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-2">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};