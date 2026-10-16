import { config } from '../config.js';
import { HttpError } from './http-error.js';

// This is the only file that calls fetch or knows Open-Meteo's URLs.
// The exact requests are on the assignment page.

// TODO (you): write a helper that fetches a URL and returns the parsed JSON.
//   - Pass signal: AbortSignal.timeout(config.upstreamTimeoutMs) to fetch.
//   - fetch resolves for every HTTP status, so check res.ok yourself.
//   - Turn every failure into an HttpError: 504 when the timeout fired
//     (err.name is 'TimeoutError'), 502 for a network failure, a status that
//     isn't ok, or a body that isn't JSON.

// TODO (you): look up a city with the geocoding API and return
// { name, region, country, latitude, longitude, timezone } for the first result.
// Throw a 404 HttpError when there are no results.

async function fetchJson(url, serviceName) {
  let response;

  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(config.upstreamTimeoutMs)
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new HttpError(
        504,
        `The ${serviceName} service did not respond within ${config.upstreamTimeoutMs} ms`
      );
    }

    throw new HttpError(
      502,
      `Could not get a valid response from the ${serviceName} service`
    );
  }

  if (!response.ok) {
    throw new HttpError(
      502,
      `Could not get a valid response from the ${serviceName} service`
    );
  }

  try {
    return await response.json();
  } catch {
    throw new HttpError(
      502,
      `Could not get a valid response from the ${serviceName} service`
    );
  }
}
export async function geocodeCity(name) {
  const url = new URL(`${config.geocodingUrl}/search`);

  url.search = new URLSearchParams({
    name: name,
    count: '1',
    language: 'en',
    format: 'json'
  });

  const data = await fetchJson(url, 'geocoding');

  if (!data.results || data.results.length === 0) {
    throw new HttpError(404, `City "${name}" was not found`);
  }

  const city = data.results[0];

  return {
    name: city.name,
    region: city.admin1 || null,
    country: city.country || null,
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone
  };
}
// TODO (you): get the current weather and a 3-day daily forecast from the
// forecast API and return the parsed response.
export async function getForecast(latitude, longitude) {
  const url = new URL(`${config.forecastUrl}/forecast`);

  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '3'
  });

  return await fetchJson(url, 'forecast');
}
