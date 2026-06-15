import type { WeatherCondition } from './types';

// ---------------------------------------------------------------------------
// WMO Weather interpretation codes -> human readable label + broad condition
// https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")
// ---------------------------------------------------------------------------

export const WEATHER_CODE_MAP: Record<
  number,
  { label: string; condition: WeatherCondition }
> = {
  0: { label: 'Clear Sky', condition: 'clear' },
  1: { label: 'Mainly Clear', condition: 'mainly-clear' },
  2: { label: 'Partly Cloudy', condition: 'cloudy' },
  3: { label: 'Overcast', condition: 'cloudy' },
  45: { label: 'Fog', condition: 'fog' },
  48: { label: 'Rime Fog', condition: 'fog' },
  51: { label: 'Light Drizzle', condition: 'drizzle' },
  53: { label: 'Drizzle', condition: 'drizzle' },
  55: { label: 'Dense Drizzle', condition: 'drizzle' },
  56: { label: 'Freezing Drizzle', condition: 'drizzle' },
  57: { label: 'Dense Freezing Drizzle', condition: 'drizzle' },
  61: { label: 'Light Rain', condition: 'rain' },
  63: { label: 'Rain', condition: 'rain' },
  65: { label: 'Heavy Rain', condition: 'rain' },
  66: { label: 'Freezing Rain', condition: 'rain' },
  67: { label: 'Heavy Freezing Rain', condition: 'rain' },
  71: { label: 'Light Snow', condition: 'snow' },
  73: { label: 'Snow', condition: 'snow' },
  75: { label: 'Heavy Snow', condition: 'snow' },
  77: { label: 'Snow Grains', condition: 'snow' },
  80: { label: 'Light Showers', condition: 'rain' },
  81: { label: 'Showers', condition: 'rain' },
  82: { label: 'Violent Showers', condition: 'rain' },
  85: { label: 'Snow Showers', condition: 'snow' },
  86: { label: 'Heavy Snow Showers', condition: 'snow' },
  95: { label: 'Thunderstorm', condition: 'thunderstorm' },
  96: { label: 'Thunderstorm w/ Hail', condition: 'thunderstorm' },
  99: { label: 'Severe Thunderstorm', condition: 'thunderstorm' },
};

export function getWeatherInfo(code: number) {
  return WEATHER_CODE_MAP[code] ?? { label: 'Unknown', condition: 'clear' as WeatherCondition };
}

// ---------------------------------------------------------------------------
// Dynamic background gradients keyed by condition + day/night
// ---------------------------------------------------------------------------

export const BACKGROUND_THEMES: Record<
  WeatherCondition,
  { day: string; night: string }
> = {
  clear: {
    day: 'from-[#1e3a8a] via-[#3b5fb8] to-[#0a0d1f]',
    night: 'from-[#05060f] via-[#10142b] to-[#1b1140]',
  },
  'mainly-clear': {
    day: 'from-[#1e3a8a] via-[#4a5fc1] to-[#0a0d1f]',
    night: 'from-[#05060f] via-[#161b35] to-[#241555]',
  },
  cloudy: {
    day: 'from-[#374159] via-[#4b5575] to-[#0a0d1f]',
    night: 'from-[#05060f] via-[#161a2e] to-[#1d2238]',
  },
  fog: {
    day: 'from-[#4b5870] via-[#5c6a87] to-[#10142b]',
    night: 'from-[#05060f] via-[#171b2c] to-[#202538]',
  },
  drizzle: {
    day: 'from-[#2c3e6e] via-[#3f5187] to-[#0a0d1f]',
    night: 'from-[#05060f] via-[#13182d] to-[#1c2342]',
  },
  rain: {
    day: 'from-[#1f2c4f] via-[#324070] to-[#070a16]',
    night: 'from-[#03040a] via-[#0f1326] to-[#181c33]',
  },
  snow: {
    day: 'from-[#3a4a6b] via-[#5a6c93] to-[#0e1226]',
    night: 'from-[#05060f] via-[#181d35] to-[#262c4a]',
  },
  thunderstorm: {
    day: 'from-[#1a1f3a] via-[#2c2f55] to-[#05060f]',
    night: 'from-[#03040a] via-[#14122c] to-[#231248]',
  },
};

// ---------------------------------------------------------------------------
// Open-Meteo API endpoints (no API key required)
// ---------------------------------------------------------------------------

export const OPEN_METEO_FORECAST_URL =
  process.env.NEXT_PUBLIC_OPEN_METEO_FORECAST_URL ??
  'https://api.open-meteo.com/v1/forecast';

export const OPEN_METEO_AIR_QUALITY_URL =
  process.env.NEXT_PUBLIC_OPEN_METEO_AIR_QUALITY_URL ??
  'https://air-quality-api.open-meteo.com/v1/air-quality';

export const OPEN_METEO_GEOCODING_URL =
  process.env.NEXT_PUBLIC_OPEN_METEO_GEOCODING_URL ??
  'https://geocoding-api.open-meteo.com/v1/search';

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export const RECENT_SEARCHES_KEY = 'aurora-weather-recent-searches';
export const THEME_KEY = 'aurora-weather-theme';
export const MAX_RECENT_SEARCHES = 5;

export const DEFAULT_LOCATION = {
  name: 'New York',
  country: 'United States',
  latitude: 40.7128,
  longitude: -74.006,
};

export function aqiLabel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: 'Good', color: '#22d3ee' };
  if (aqi <= 100) return { label: 'Moderate', color: '#a3e635' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#facc15' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#fb923c' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#f87171' };
  return { label: 'Hazardous', color: '#c084fc' };
}

export function uvLabel(uv: number): { label: string; color: string } {
  if (uv < 3) return { label: 'Low', color: '#22d3ee' };
  if (uv < 6) return { label: 'Moderate', color: '#a3e635' };
  if (uv < 8) return { label: 'High', color: '#facc15' };
  if (uv < 11) return { label: 'Very High', color: '#fb923c' };
  return { label: 'Extreme', color: '#f87171' };
}
