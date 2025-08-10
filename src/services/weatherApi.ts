import { WeatherData, CityResult, WeatherAlert } from '../types/weather';

// 高德API配置
const AMAP_KEY = '	0f6852989f186ff24b3038cafc4d9349'; // 需要替换为实际的高德API密钥
const BASE_URL = 'https://restapi.amap.com/v3';

// 缓存接口
interface CacheItem {
  data: any;
  timestamp: number;
  expiry: number;
}

// API服务类
export class WeatherApiService {
  private static instance: WeatherApiService;
  private apiKey: string;
  private cache: Map<string, CacheItem> = new Map();
  private lastRequestTime: number = 0;
  private readonly REQUEST_INTERVAL = 1000; // 1秒间隔
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存

  private constructor() {
    this.apiKey = AMAP_KEY;
  }

  public static getInstance(): WeatherApiService {
    if (!WeatherApiService.instance) {
      WeatherApiService.instance = new WeatherApiService();
    }
    return WeatherApiService.instance;
  }

  // 检查缓存
  private getFromCache(key: string): any | null {
    const item = this.cache.get(key);
    if (item && Date.now() < item.expiry) {
      console.log('从缓存获取数据:', key);
      return item.data;
    }
    if (item) {
      this.cache.delete(key);
    }
    return null;
  }

  // 设置缓存
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + this.CACHE_DURATION
    });
  }

  // 频率控制
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.REQUEST_INTERVAL) {
      const waitTime = this.REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`API频率控制，等待 ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  // 处理API错误
  private handleApiError(data: any, operation: string): string {
    if (data.info === 'CUQPS_HAS_EXCEEDED_THE_LIMIT') {
      return `API调用频率超限，请稍后再试。建议减少查询频率或升级API套餐。`;
    }
    if (data.info === 'USERKEY_PLAT_NOMATCH') {
      return `API密钥配置错误，请检查密钥是否正确。`;
    }
    return `${operation}失败: ${data.info || '未知错误'}`;
  }

  // 获取城市天气信息
  async getWeatherByCity(city: string): Promise<WeatherData | null> {
    try {
      const cacheKey = `weather_${city}`;
      
      // 检查缓存
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // 频率控制
      await this.waitForRateLimit();
      
      const url = `${BASE_URL}/weather/weatherInfo?key=${this.apiKey}&city=${encodeURIComponent(city)}&extensions=all`;
      console.log('请求天气信息URL:', url);
      
      const response = await fetch(url);
      console.log('API响应状态:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('API响应数据:', data);
      
      if (data.status === '1' && data.forecasts?.length > 0) {
        console.log('天气数据获取成功:', data.forecasts[0]);
        const weatherData = data.forecasts[0];
        // 缓存数据
        this.setCache(cacheKey, weatherData);
        return weatherData;
      } else {
        const errorMsg = this.handleApiError(data, '获取天气信息');
        console.error(errorMsg);
        // 如果是频率超限，返回提示信息而不是null
        if (data.info === 'CUQPS_HAS_EXCEEDED_THE_LIMIT') {
          throw new Error(errorMsg);
        }
        return null;
      }
    } catch (error) {
      console.error('获取天气信息失败:', error);
      if (error instanceof Error && error.message.includes('频率超限')) {
        throw error;
      }
      return null;
    }
  }

  // 获取实时天气
  async getLiveWeather(city: string) {
    try {
      const cacheKey = `live_${city}`;
      
      // 检查缓存
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // 频率控制
      await this.waitForRateLimit();
      
      const url = `${BASE_URL}/weather/weatherInfo?key=${this.apiKey}&city=${encodeURIComponent(city)}&extensions=base`;
      console.log('请求实时天气URL:', url);
      
      const response = await fetch(url);
      console.log('实时天气API响应状态:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('实时天气API响应数据:', data);
      
      if (data.status === '1' && data.lives?.length > 0) {
        console.log('实时天气数据获取成功:', data.lives[0]);
        const liveData = data.lives[0];
        // 缓存数据（实时天气缓存时间较短）
        this.setCache(cacheKey, liveData);
        return liveData;
      } else {
        const errorMsg = this.handleApiError(data, '获取实时天气');
        console.error(errorMsg);
        if (data.info === 'CUQPS_HAS_EXCEEDED_THE_LIMIT') {
          throw new Error(errorMsg);
        }
        return null;
      }
    } catch (error) {
      console.error('获取实时天气失败:', error);
      if (error instanceof Error && error.message.includes('频率超限')) {
        throw error;
      }
      return null;
    }
  }

  // 搜索城市
  async searchCities(keyword: string): Promise<CityResult[]> {
    try {
      const cacheKey = `search_${keyword}`;
      
      // 检查缓存
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // 频率控制
      await this.waitForRateLimit();
      
      const url = `${BASE_URL}/config/district?key=${this.apiKey}&keywords=${encodeURIComponent(keyword)}&subdistrict=0`;
      console.log('搜索城市URL:', url);
      
      const response = await fetch(url);
      console.log('城市搜索API响应状态:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('城市搜索API响应数据:', data);
      
      if (data.status === '1' && data.districts?.length > 0) {
        const cities = data.districts.map((district: any) => ({
          name: district.name,
          adcode: district.adcode,
          citycode: district.citycode,
          district: []
        }));
        console.log('城市搜索成功，找到', cities.length, '个城市:', cities);
        // 缓存搜索结果
        this.setCache(cacheKey, cities);
        return cities;
      } else {
        const errorMsg = this.handleApiError(data, '搜索城市');
        console.error(errorMsg);
        if (data.info === 'CUQPS_HAS_EXCEEDED_THE_LIMIT') {
          throw new Error(errorMsg);
        }
        return [];
      }
    } catch (error) {
      console.error('搜索城市失败:', error);
      if (error instanceof Error && error.message.includes('频率超限')) {
        throw error;
      }
      return [];
    }
  }

  // 获取天气预警信息（模拟数据，实际需要对接预警API）
  async getWeatherAlerts(adcode: string): Promise<WeatherAlert[]> {
    // 这里使用模拟数据，实际项目中需要对接真实的预警API
    const mockAlerts: WeatherAlert[] = [
      {
        level: 'yellow',
        type: '暴雨',
        title: '暴雨黄色预警',
        content: '预计未来6小时内降雨量将达50毫米以上，请注意防范。',
        publishTime: new Date().toISOString(),
        effectiveTime: new Date().toISOString(),
        expireTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // 随机返回预警信息（30%概率）
    return Math.random() > 0.7 ? mockAlerts : [];
  }
}

// 导出单例实例
export const weatherApi = WeatherApiService.getInstance();

// 模拟天气数据（用于开发测试）
export const mockWeatherData: WeatherData = {
  city: '北京市',
  adcode: '110000',
  province: '北京',
  reporttime: new Date().toISOString(),
  casts: [
    {
      date: new Date().toISOString().split('T')[0],
      week: '1',
      dayweather: '晴',
      nightweather: '晴',
      daytemp: '25',
      nighttemp: '15',
      daywind: '东北',
      nightwind: '东北',
      daypower: '≤3',
      nightpower: '≤3',
      daytemp_float: '25.0',
      nighttemp_float: '15.0'
    },
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      week: '2',
      dayweather: '多云',
      nightweather: '多云',
      daytemp: '23',
      nighttemp: '13',
      daywind: '东北',
      nightwind: '东北',
      daypower: '≤3',
      nightpower: '≤3',
      daytemp_float: '23.0',
      nighttemp_float: '13.0'
    },
    {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      week: '3',
      dayweather: '小雨',
      nightweather: '小雨',
      daytemp: '20',
      nighttemp: '12',
      daywind: '东',
      nightwind: '东',
      daypower: '≤3',
      nightpower: '≤3',
      daytemp_float: '20.0',
      nighttemp_float: '12.0'
    }
  ]
};