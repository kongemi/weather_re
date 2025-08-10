// 天气数据类型定义
export interface WeatherData {
  city: string;
  adcode: string;
  province: string;
  reporttime: string;
  casts: WeatherForecast[];
  lives?: LiveWeather[];
}

export interface LiveWeather {
  province: string;
  city: string;
  adcode: string;
  weather: string;
  temperature: string;
  winddirection: string;
  windpower: string;
  humidity: string;
  reporttime: string;
  temperature_float: string;
  humidity_float: string;
}

export interface WeatherForecast {
  date: string;
  week: string;
  dayweather: string;
  nightweather: string;
  daytemp: string;
  nighttemp: string;
  daywind: string;
  nightwind: string;
  daypower: string;
  nightpower: string;
  daytemp_float: string;
  nighttemp_float: string;
}

// 城市搜索结果类型
export interface CityResult {
  name: string;
  adcode: string;
  citycode: string;
  district: string[];
}

// 天气预警类型
export interface WeatherAlert {
  level: 'blue' | 'yellow' | 'orange' | 'red' | 'black';
  type: string;
  title: string;
  content: string;
  publishTime: string;
  effectiveTime: string;
  expireTime: string;
}

// 天气动画类型
export type WeatherAnimationType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'foggy';

// 热门城市类型
export interface PopularCity {
  name: string;
  adcode: string;
  temperature?: string;
  weather?: string;
}

// 搜索历史类型
export interface SearchHistory {
  id: string;
  city: string;
  adcode: string;
  searchTime: number;
}