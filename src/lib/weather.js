export const KINDS = {
  clear: { label: "Clear Sky", icon: "☀️" },
  cloud: { label: "Cloudy", icon: "☁️" },
  fog: { label: "Foggy", icon: "🌫️" },
  rain: { label: "Rainy", icon: "🌧️" },
  snow: { label: "Snowy", icon: "❄️" },
  storm: { label: "Thunderstorm", icon: "⛈️" },
};

// Open-Meteo WMO weather codes -> simple kind
export function kindFromCode(c) {
  if (c === 0) return "clear";
  if (c <= 3) return "cloud";
  if (c <= 48) return "fog";
  if (c <= 67 || (c >= 80 && c <= 82)) return "rain";
  if (c <= 77 || c === 85 || c === 86) return "snow";
  return "storm";
}

export const gradient = (kind, isDay) => {
  if (!isDay) return "from-indigo-950 via-purple-900 to-fuchsia-800";
  return {
    clear: "from-sky-400 via-cyan-300 to-pink-200",
    cloud: "from-slate-400 via-sky-300 to-rose-200",
    fog: "from-slate-300 via-gray-300 to-pink-100",
    rain: "from-slate-600 via-blue-500 to-indigo-300",
    snow: "from-sky-200 via-blue-100 to-pink-100",
    storm: "from-gray-800 via-purple-700 to-slate-500",
  }[kind];
};

export async function searchPlaces(q) {
  const r = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5`
  );
  const d = await r.json();
  return (d.results || []).map((p) => ({
    name: `${p.name}${p.admin1 ? ", " + p.admin1 : ""}, ${p.country_code}`,
    lat: p.latitude,
    lon: p.longitude,
  }));
}

export async function getWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Weather request failed");
  return r.json();
}
