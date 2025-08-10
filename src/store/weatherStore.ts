import { create } from 'zustand';
import { WeatherData, LiveWeather, SearchHistory, PopularCity, WeatherAlert } from '../types/weather';
import { weatherApi, mockWeatherData } from '../services/weatherApi';

interface WeatherStore {
  // 状态
  currentWeather: WeatherData | null;
  liveWeather: LiveWeather | null;
  selectedCity: string;
  searchHistory: SearchHistory[];
  popularCities: PopularCity[];
  weatherAlerts: WeatherAlert[];
  loading: boolean;
  error: string | null;

  // 操作
  setCurrentWeather: (weather: WeatherData) => void;
  setLiveWeather: (weather: LiveWeather) => void;
  setSelectedCity: (city: string) => void;
  addSearchHistory: (city: string, adcode: string) => void;
  removeSearchHistory: (id: string) => void;
  clearSearchHistory: () => void;
  fetchWeatherByCity: (city: string) => Promise<void>;
  fetchLiveWeather: (city: string) => Promise<void>;
  fetchWeatherAlerts: (adcode: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  // 初始状态
  currentWeather: null,
  liveWeather: null,
  selectedCity: '北京市',
  searchHistory: [],
  popularCities: [
    { name: '北京市', adcode: '110000' },
    { name: '上海市', adcode: '310000' },
    { name: '广州市', adcode: '440100' },
    { name: '深圳市', adcode: '440300' },
    { name: '杭州市', adcode: '330100' },
    { name: '成都市', adcode: '510100' },
    { name: '西安市', adcode: '610100' },
    { name: '武汉市', adcode: '420100' }
  ],
  weatherAlerts: [],
  loading: false,
  error: null,

  // 设置当前天气
  setCurrentWeather: (weather) => {
    set({ currentWeather: weather });
  },

  // 设置实时天气
  setLiveWeather: (weather) => {
    set({ liveWeather: weather });
  },

  // 设置选中城市
  setSelectedCity: (city) => {
    set({ selectedCity: city });
  },

  // 添加搜索历史
  addSearchHistory: (city, adcode) => {
    const { searchHistory } = get();
    const existingIndex = searchHistory.findIndex(item => item.city === city);
    
    if (existingIndex !== -1) {
      // 如果已存在，更新时间并移到最前面
      const updatedHistory = [...searchHistory];
      updatedHistory[existingIndex].searchTime = Date.now();
      updatedHistory.sort((a, b) => b.searchTime - a.searchTime);
      set({ searchHistory: updatedHistory });
    } else {
      // 添加新记录
      const newHistory: SearchHistory = {
        id: Date.now().toString(),
        city,
        adcode,
        searchTime: Date.now()
      };
      const updatedHistory = [newHistory, ...searchHistory].slice(0, 10); // 最多保存10条
      set({ searchHistory: updatedHistory });
    }
  },

  // 删除搜索历史
  removeSearchHistory: (id) => {
    const { searchHistory } = get();
    set({ searchHistory: searchHistory.filter(item => item.id !== id) });
  },

  // 清空搜索历史
  clearSearchHistory: () => {
    set({ searchHistory: [] });
  },

  // 获取城市天气
  fetchWeatherByCity: async (city) => {
    set({ loading: true, error: null });
    try {
      const weather = await weatherApi.getWeatherByCity(city);
      if (weather) {
        set({ currentWeather: weather, selectedCity: city });
      } else {
        set({ error: '获取天气信息失败，请稍后重试' });
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('频率超限')) {
          set({ error: error.message });
        } else {
          set({ error: '网络请求失败，请检查网络连接' });
        }
      } else {
        set({ error: '获取天气信息时发生未知错误' });
      }
    } finally {
      set({ loading: false });
    }
  },

  // 获取实时天气
  fetchLiveWeather: async (city) => {
    try {
      const liveWeather = await weatherApi.getLiveWeather(city);
      if (liveWeather) {
        set({ liveWeather });
      }
    } catch (error) {
      console.error('获取实时天气失败:', error);
      if (error instanceof Error && error.message.includes('频率超限')) {
        set({ error: error.message });
      }
    }
  },

  // 获取天气预警
  fetchWeatherAlerts: async (adcode) => {
    try {
      const alerts = await weatherApi.getWeatherAlerts(adcode);
      set({ weatherAlerts: alerts });
    } catch (error) {
      console.error('获取天气预警失败:', error);
    }
  },

  // 设置加载状态
  setLoading: (loading) => {
    set({ loading });
  },

  // 设置错误信息
  setError: (error) => {
    set({ error });
  }
}));