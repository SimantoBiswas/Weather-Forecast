# AuroraWeather — Premium Weather Dashboard

A production-ready, Awwwards-inspired weather dashboard built with **Next.js 14 (App Router)**,
**React 18**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. All weather data comes
from the free, key-less **[Open-Meteo](https://open-meteo.com/)** API.

## ✨ Features

- **Current conditions**: temperature, feels-like, humidity, wind (speed + direction),
  pressure, visibility, and weather condition with animated icons.
- **Hourly forecast**: smooth horizontal slider for the next 24 hours.
- **7-day forecast**: temperature range bars, precipitation chance, and icons.
- **Air Quality Index**: animated gauge with PM2.5, PM10, Ozone, NO₂ breakdown (US AQI).
- **Sun & UV**: sunrise/sunset arc visualization and an animated UV index meter.
- **Search**: debounced city autocomplete (Open-Meteo Geocoding API), "use my location"
  via the browser Geolocation API, and persisted recent searches.
- **Dynamic backgrounds**: gradient and ambient blobs shift based on weather condition
  and day/night.
- **Dark glassmorphism UI**: neon glow hover states, gradient borders, premium typography
  (Space Grotesk + Inter).
- **Extras**: dark/light mode toggle, scroll progress bar, custom animated cursor,
  floating particles, loading skeletons, and graceful error states with retry.
- **Auto-refresh**: weather data refreshes every 10 minutes for "real-time" updates.

## 🗂 Project structure

```
weather-app/
├── app/
│   ├── layout.tsx        # Root layout, fonts, SEO metadata
│   ├── page.tsx           # Homepage — assembles the dashboard
│   └── globals.css        # Tailwind layers + glassmorphism utilities
├── components/
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── HeroWeatherCard.tsx
│   ├── HourlyForecast.tsx
│   ├── WeeklyForecast.tsx
│   ├── AirQualityCard.tsx
│   ├── SunInfoCard.tsx
│   ├── Footer.tsx
│   ├── WeatherIcon.tsx        # Animated SVG weather icons
│   ├── WeatherBackground.tsx  # Dynamic gradient background
│   ├── ParticlesBackground.tsx
│   ├── CustomCursor.tsx
│   ├── ScrollProgress.tsx
│   ├── WeatherSkeleton.tsx
│   └── ErrorState.tsx
├── hooks/
│   ├── useWeather.ts      # Fetching, refresh, recent searches
│   ├── useGeolocation.ts
│   ├── useTheme.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── api.ts             # Open-Meteo API calls + response mapping
│   ├── types.ts           # Domain + API response types
│   ├── constants.ts       # Weather code map, gradients, helpers
│   └── utils.ts           # Formatting helpers
├── tailwind.config.ts
├── next.config.mjs
└── .env.example
```

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. (optional) copy env file — Open-Meteo needs no API key,
#    but you can override endpoints here if desired
cp .env.example .env.local

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:3000
```

### Build for production

```bash
npm run build
npm run start
```

## 🔌 API reference

All requests are made client-side directly to Open-Meteo's free, no-auth endpoints:

- **Forecast**: `https://api.open-meteo.com/v1/forecast`
  (current conditions, hourly, and 7-day daily forecasts)
- **Air Quality**: `https://air-quality-api.open-meteo.com/v1/air-quality`
  (US AQI, PM2.5, PM10, Ozone, NO₂, CO, SO₂)
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
  (city search for the search bar)

See `lib/api.ts` for the full request/response mapping and `lib/types.ts` for typed
shapes of both the raw API responses and the app's domain models.

## 🎨 Design system

- **Palette**: deep navy/black base (`#03040a` → `#10142b`) with indigo, violet, purple,
  and cyan accents.
- **Typography**: `Space Grotesk` for display/headings, `Inter` for body text,
  `JetBrains Mono` for data figures.
- **Surfaces**: `.glass-panel` utility (in `globals.css`) provides the frosted-glass
  card look with subtle inner highlights and gradient borders.
- **Motion**: Framer Motion powers entrance animations, hover scaling, the hero icon's
  floating loop, animated gauges, and page-level fade transitions.

## ♿ Accessibility & performance notes

- Custom cursor and particle effects are disabled on touch devices and are
  `aria-hidden` where purely decorative.
- All interactive elements have descriptive `aria-label`s.
- Images are avoided in favor of lightweight inline SVG icons for fast loading.
- Data fetching runs in parallel (`Promise.all`) and auto-refreshes every 10 minutes.
