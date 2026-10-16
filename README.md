# City Weather API

This project is a simple weather API made with Node.js and Express. It gets weather information from Open-Meteo and lets users check the weather for a city, compare cities and check the cache.

## How to Run

You need Node.js version 24 or newer.

First, install the packages:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Start the server:

```bash
npm start
```

The server runs at `http://localhost:4000`.

## Environment Variables

| Variable | Default | What it does |
|---|---|---|
| `PORT` | `4000` | Sets the server port |
| `GEOCODING_URL` | `https://geocoding-api.open-meteo.com/v1` | Used to find a city's location |
| `FORECAST_URL` | `https://api.open-meteo.com/v1` | Used to get weather information |
| `UPSTREAM_TIMEOUT_MS` | `5000` | Sets how long to wait for the weather API |
| `CACHE_TTL_SECONDS` | `600` | Sets how long weather data stays in the cache |

## API Endpoints

### 1. Get weather for a city

Example:

```bash
curl -i "http://localhost:4000/api/weather?city=Toronto"
```

This returns the city's location, current weather, and a three-day forecast.

### 2. Compare cities

Example:

```bash
curl -i "http://localhost:4000/api/compare?cities=Toronto,Vancouver,Halifax"
```

This compares the weather in 2 to 5 cities and shows which city is warmest and coldest.

### 3. Check cache statistics

Example:

```bash
curl -i "http://localhost:4000/api/cache/stats"
```

This shows the number of cache entries, hits, misses, and the cache time limit.

## Testing

Run these commands in Git Bash while the server is running.

```bash
# 1. Get weather for Toronto: 200
curl -i "http://localhost:4000/api/weather?city=Toronto"

# 2. Get Toronto weather again to test the cache: 200
curl -i "http://localhost:4000/api/weather?city=Toronto"

# 3. Missing city: 400
curl -i "http://localhost:4000/api/weather"

# 4. City not found: 404
curl -i "http://localhost:4000/api/weather?city=NotARealCityXYZ"

# 5. Compare three cities: 200
curl -i "http://localhost:4000/api/compare?cities=Toronto,Vancouver,Halifax"

# 6. Compare with an unknown city: 200, with one failed result
curl -i "http://localhost:4000/api/compare?cities=Toronto,NotARealCityXYZ"

# 7. Too many cities: 400
curl -i "http://localhost:4000/api/compare?cities=Toronto,Vancouver,Halifax,Calgary,Ottawa,Montreal"

# 8. Duplicate cities: 400
curl -i "http://localhost:4000/api/compare?cities=Toronto,toronto"

# 9. Check cache statistics: 200
curl -i "http://localhost:4000/api/cache/stats"

# 10. Unknown route: 404
curl -i "http://localhost:4000/unknown"
```

## Data Source

This project uses [Open-Meteo](https://open-meteo.com/) for weather and location information.

## AI Use

I used ChatGPT to help me understand the assignment, fix some codes errors and test the API. I ran the API and checked the results myself.
