import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sky from "./components/Sky";
import Clock from "./components/Clock";
import Miko from "./components/Miko";
import Omikuji from "./components/Omikuji";
import { KINDS, kindFromCode, gradient, searchPlaces, getWeather } from "./lib/weather";

export default function App() {
  const [place, setPlace] = useState({ name: "Gurugram, Haryana, IN", lat: 28.4595, lon: 77.0266 });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    setData(null); setError("");
    getWeather(place.lat, place.lon).then(setData).catch((e) => setError(e.message));
  }, [place]);

  const search = async (e) => {
    e.preventDefault();
    if (q.trim()) setResults(await searchPlaces(q.trim()));
  };

  const cur = data?.current;
  const kind = cur ? kindFromCode(cur.weather_code) : "clear";
  const isDay = cur ? cur.is_day === 1 : true;

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${gradient(kind, isDay)} font-anime transition-all duration-1000`}>
      <Sky kind={kind} isDay={isDay} />
      <Miko side="left" />

      <main className="relative z-10 mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-4 text-center text-3xl font-black text-white drop-shadow">⛩️ Miko Weather</h1>

        <form onSubmit={search} className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a city or region…"
            className="flex-1 rounded-full bg-white/80 px-4 py-2 outline-none placeholder:text-slate-500" />
          <button className="rounded-full bg-rose-500 px-5 font-bold text-white hover:bg-rose-600">Go</button>
        </form>

        {results.length > 0 && (
          <ul className="mt-2 overflow-hidden rounded-2xl bg-white/90 shadow">
            {results.map((r, i) => (
              <li key={i} onClick={() => { setPlace(r); setResults([]); setQ(""); }}
                className="cursor-pointer px-4 py-2 hover:bg-rose-100">{r.name}</li>
            ))}
          </ul>
        )}

        <div className="mt-6"><Clock timeZone={data?.timezone} /></div>

        <motion.div key={place.name + (cur?.time || "")} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-white/40 bg-white/20 p-6 text-center text-white shadow-xl backdrop-blur-xl">
          <div className="text-lg font-bold">📍 {place.name}</div>
          {error && <p className="mt-4">⚠️ {error}</p>}
          {!data && !error && <p className="mt-4 animate-pulse">Miko is asking the sky spirits…</p>}
          {cur && (
            <>
              <motion.div className="text-7xl" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                {KINDS[kind].icon}
              </motion.div>
              <div className="text-6xl font-black">{Math.round(cur.temperature_2m)}°C</div>
              <div className="text-xl">{KINDS[kind].label}</div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <Stat label="Feels like" value={`${Math.round(cur.apparent_temperature)}°`} />
                <Stat label="Humidity" value={`${cur.relative_humidity_2m}%`} />
                <Stat label="Wind" value={`${cur.wind_speed_10m} km/h`} />
              </div>
              <div className="mt-3 text-sm opacity-90">
                High {Math.round(data.daily.temperature_2m_max[0])}° · Low {Math.round(data.daily.temperature_2m_min[0])}°
              </div>
            </>
          )}
        </motion.div>

        {cur && <Omikuji kind={kind} temp={cur.temperature_2m} />}
      </main>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded-2xl bg-white/20 p-2">
    <div className="opacity-80">{label}</div>
    <div className="font-bold">{value}</div>
  </div>
);
