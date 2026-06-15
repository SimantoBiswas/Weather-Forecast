// ---------------------------------------------------------------------------
// Core domain types used throughout the app
// ---------------------------------------------------------------------------

export interface GeoLocation {
  id?: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  cloudCover: number;
  visibility: number; // meters
  uvIndex: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationProbabilityMax: number;
}

export interface AirQuality {
  aqi: number;
  pm2_5: number;
  pm10: number;
  ozone: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQuality | null;
}

// ---------------------------------------------------------------------------
// Raw Open-Meteo API response shapes (subset of fields we consume)
// ---------------------------------------------------------------------------

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    is_day: number[];
    visibility: number[];
    uv_index: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_probability_max: number[];
  };
}

export interface OpenMeteoAirQualityResponse {
  current: {
    time: string;
    us_aqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
    carbon_monoxide: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
  };
}

export interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    timezone: string;
  }>;
}

// ---------------------------------------------------------------------------
// UI helper types
// ---------------------------------------------------------------------------

export type WeatherCondition =
  | 'clear'
  | 'mainly-clear'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export type ThemeMode = 'dark' | 'light';

export interface RecentSearch {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}
