import {
  getCacheValue,
  setCacheValue,
  getCacheStats
} from './cache.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';

export async function getCityWeather(city) {
  const key = city.trim().toLowerCase();
  const saved = getCacheValue(key);

  if (saved) {
    return { ...saved, cached: true };
  }

  const location = await geocodeCity(city);
  const forecast = await getForecast(
    location.latitude,
    location.longitude
  );

  const data = {
    location,
    current: {
      time: forecast.current.time,
      temperatureC: forecast.current.temperature_2m,
      feelsLikeC: forecast.current.apparent_temperature,
      humidityPercent: forecast.current.relative_humidity_2m,
      windKmh: forecast.current.wind_speed_10m,
      weatherCode: forecast.current.weather_code,
      conditions: describeWeatherCode(forecast.current.weather_code)
    },
    daily: forecast.daily.time.map((date, i) => ({
      date,
      minC: forecast.daily.temperature_2m_min[i],
      maxC: forecast.daily.temperature_2m_max[i],
      precipitationChancePercent:
        forecast.daily.precipitation_probability_max?.[i] ?? null,
      weatherCode: forecast.daily.weather_code[i],
      conditions: describeWeatherCode(forecast.daily.weather_code[i])
    })),
    fetchedAt: new Date().toISOString(),
    cached: false
  };

  setCacheValue(key, data);

  return data;
}

export { getCacheStats };
