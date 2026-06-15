import {
  OPEN_METEO_AIR_QUALITY_URL,
  OPEN_METEO_FORECAST_URL,
  OPEN_METEO_GEOCODING_URL,
} from './constants';
import type {
  AirQuality,
  CurrentWeather,
  DailyForecastItem,
  GeoLocation,
  HourlyForecastItem,
  OpenMeteoAirQualityResponse,
  OpenMeteoForecastResponse,
  OpenMeteoGeocodingResponse,
  WeatherData,
} from './types';

/**
 * Search for locations by name using the free Open-Meteo Geocoding API.
 * Docs: https://open-meteo.com/en/docs/geocoding-api
 */
export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const url = new URL(OPEN_METEO_GEOCODING_URL);
  url.searchParams.set('name', query.trim());
  url.searchParams.set('count', '6');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Unable to search locations right now.');
  }

  const data: OpenMeteoGeocodingResponse = await res.json();

  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}

/**
 * Fetch the full weather payload (current, hourly, daily) for a coordinate
 * pair, plus air quality data, using Open-Meteo's free forecast endpoints.
 * Docs: https://open-meteo.com/en/docs
 */
export async function fetchWeatherData(location: GeoLocation): Promise<WeatherData> {
  const [forecast, airQuality] = await Promise.all([
    fetchForecast(location.latitude, location.longitude),
    fetchAirQuality(location.latitude, location.longitude).catch(() => null),
  ]);

  return {
    location,
    current: forecast.current,
    hourly: forecast.hourly,
    daily: forecast.daily,
    airQuality,
  };
}

async function fetchForecast(latitude: number, longitude: number) {
  const url = new URL(OPEN_METEO_FORECAST_URL);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('temperature_unit', 'celsius');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('precipitation_unit', 'mm');
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(',')
  );
  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'is_day',
      'visibility',
      'uv_index',
    ].join(',')
  );
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_probability_max',
    ].join(',')
  );
  url.searchParams.set('forecast_days', '8');

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Unable to load weather data right now.');
  }

  const data: OpenMeteoForecastResponse = await res.json();
  return {
    current: mapCurrentWeather(data),
    hourly: mapHourlyForecast(data),
    daily: mapDailyForecast(data),
  };
}

async function fetchAirQuality(latitude: number, longitude: number): Promise<AirQuality> {
  const url = new URL(OPEN_METEO_AIR_QUALITY_URL);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set(
    'current',
    [
      'us_aqi',
      'pm2_5',
      'pm10',
      'ozone',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
    ].join(',')
  );

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Unable to load air quality data.');
  }

  const data: OpenMeteoAirQualityResponse = await res.json();

  return {
    aqi: Math.round(data.current.us_aqi),
    pm2_5: data.current.pm2_5,
    pm10: data.current.pm10,
    ozone: data.current.ozone,
    carbonMonoxide: data.current.carbon_monoxide,
    nitrogenDioxide: data.current.nitrogen_dioxide,
    sulphurDioxide: data.current.sulphur_dioxide,
  };
}

// ---------------------------------------------------------------------------
// Mappers: raw Open-Meteo response -> app domain models
// ---------------------------------------------------------------------------

function mapCurrentWeather(data: OpenMeteoForecastResponse): CurrentWeather {
  const { current, hourly } = data;

  // Find the hourly index matching the current hour to source UV / visibility.
  const hourIndex = findClosestIndex(hourly.time, current.time);

  return {
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    pressure: current.pressure_msl,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    windGusts: current.wind_gusts_10m,
    weatherCode: current.weather_code,
    isDay: current.is_day === 1,
    precipitation: current.precipitation,
    cloudCover: current.cloud_cover,
    visibility: hourly.visibility?.[hourIndex] ?? 10000,
    uvIndex: hourly.uv_index?.[hourIndex] ?? 0,
    time: current.time,
  };
}

function mapHourlyForecast(data: OpenMeteoForecastResponse): HourlyForecastItem[] {
  const { hourly, current } = data;
  const startIndex = findClosestIndex(hourly.time, current.time);

  return hourly.time.slice(startIndex, startIndex + 24).map((time, i) => {
    const idx = startIndex + i;
    return {
      time,
      temperature: hourly.temperature_2m[idx],
      weatherCode: hourly.weather_code[idx],
      precipitationProbability: hourly.precipitation_probability[idx] ?? 0,
      isDay: hourly.is_day[idx] === 1,
    };
  });
}

function mapDailyForecast(data: OpenMeteoForecastResponse): DailyForecastItem[] {
  const { daily } = data;
  return daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
    uvIndexMax: daily.uv_index_max[i],
    precipitationProbabilityMax: daily.precipitation_probability_max[i] ?? 0,
  }));
}

function findClosestIndex(times: string[], target: string): number {
  const targetTime = new Date(target).getTime();
  let closest = 0;
  let smallestDiff = Infinity;

  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - targetTime);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closest = i;
    }
  }

  return closest;
}
