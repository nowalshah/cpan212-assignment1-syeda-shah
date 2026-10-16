
import { HttpError } from '../lib/http-error.js';

export function parseCity(value) {
  if (typeof value !== 'string') {
    throw new HttpError(400, 'Please provide one city name', {
      city: 'City is required and must be provided only once'
    });
  }

  const city = value.trim();

  if (city.length < 2 || city.length > 60) {
    throw new HttpError(400, 'Invalid city name', {
      city: 'City must be between 2 and 60 characters'
    });
  }

  return city;
}

export function parseCities(value) {
  if (typeof value !== 'string') {
    throw new HttpError(400, 'Please provide a list of cities', {
      cities: 'Cities are required and must be provided only once'
    });
  }

  const cities = value.split(',').map(city => city.trim());

  if (cities.length < 2 || cities.length > 5) {
    throw new HttpError(400, 'Invalid number of cities', {
      cities: 'Provide between 2 and 5 cities'
    });
  }

  if (cities.some(city => city.length < 2 || city.length > 60)) {
    throw new HttpError(400, 'Invalid city name', {
      cities: 'Each city must be between 2 and 60 characters'
    });
  }

  const uniqueCities = cities.map(city => city.toLowerCase());

  if (new Set(uniqueCities).size !== cities.length) {
    throw new HttpError(400, 'Duplicate cities', {
      cities: 'Each city must be different'
    });
  }

  return cities;
}
