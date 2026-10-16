import { Router } from 'express';
import { parseCity, parseCities } from '../validators/weather-query.js';
import { getCityWeather } from '../lib/weather.js';

export const weatherRouter = Router();

const attribution = 'Weather data by Open-Meteo.com (https://open-meteo.com/)';

weatherRouter.get('/weather', async (req, res, next) => {
  try {
    const city = parseCity(req.query.city);
    const data = await getCityWeather(city);
    res.json({ data, attribution });
  } catch (err) {
    next(err);
  }
});

weatherRouter.get('/compare', async (req, res, next) => {
  try {
    const cities = parseCities(req.query.cities);
    const results = await Promise.allSettled(
      cities.map(city => getCityWeather(city))
    );

    const data = results.map((result, i) => {
      if (result.status === 'fulfilled') {
        return {
          city: cities[i],
          ok: true,
          weather: result.value
        };
      }

      const err = result.reason;
      return {
        city: cities[i],
        ok: false,
        error: {
          status: err.status || 500,
          message: err.message || 'Internal server error'
        }
      };
    });

    const successful = data.filter(city => city.ok);
    const sorted = [...successful].sort(
      (a, b) => a.weather.current.temperatureC - b.weather.current.temperatureC
    );

    res.json({
      data: {
        cities: data,
        summary: {
          succeeded: successful.length,
          failed: data.length - successful.length,
          warmest: sorted.length
            ? sorted[sorted.length - 1].weather.location.name
            : null,
          coldest: sorted.length
            ? sorted[0].weather.location.name
            : null
        }
      },
      attribution
    });
  } catch (err) {
    next(err);
  }
});