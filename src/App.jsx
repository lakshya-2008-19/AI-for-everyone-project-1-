import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sky from "./components/Sky";
import Clock from "./components/Clock";
import Miko from "./components/Miko";
import Omikuji from "./components/Omikuji";
import { KINDS, kindFromCode, gradient, searchPlaces, getWeather } from "./lib/weather";

// Your 4 new anime backgrounds and stickers
const PRESET_BGS = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg'];
const PRESET_STICKERS = ['/g1.gif', '/g2.gif', '/g3.gif', '/g4.gif'];

export default function App() {
  // --- Original State ---
  const [place, setPlace] = useState({ name: "Gurugram, Haryana, IN", lat: 28.4595, lon: 77.0266 });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  // --- New Customization State (Loads from localStorage) ---
  const [bgImage, setBgImage] = useState(() => localStorage.getItem('user_bg') || ""); 
  const [sticker, setSticker] = useState(() => localStorage.getItem('user_sticker') || "");

  // Fetch Weather
  useEffect(() => {
    setData(null); setError("");
    getWeather(place.lat, place.lon).then(setData).catch((e) => setError(e.message));
  }, [place]);

  // Save Customizations automatically
  useEffect(() => {
    localStorage.setItem('user_bg', bgImage);
    localStorage.setItem('user_sticker', sticker);
  }, [bgImage, sticker]);

  const search = async (e) => {
    e.preventDefault();
    if (q.trim()) setResults(await searchPlaces(q.trim()));
  };

  // Convert uploaded images to free text-based local storage
  const handleCustomUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'bg') setBgImage(event.target.result);
      if (type === 'sticker') setSticker(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const cur = data?.current;
  const kind = cur ? kindFromCode(cur.weather_code) : "clear";
  const isDay = cur ? cur.is_day === 1 : true;

  // Decide if we use the custom background or the original gradient
  const bgClass = bgImage ? "bg-cover bg-center" : `bg-gradient-to-b ${gradient(kind, isDay)}`;
  const bgStyle = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

  return (
    <div className={`relative min-h-screen ${bgClass} font-anime transition-all duration-1000`} style={bgStyle}>
      {/* Show dynamic Sky ONLY if no custom background is selected */}
      {!bgImage && <Sky kind={kind} isDay={isDay} />}

      {/* Show custom sticker IF selected, otherwise show original animated Miko */}
      {sticker ? (
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="fixed bottom-6 right-6 z-20 pointer-events-none">
          <img src={sticker} alt="Custom Anime Sticker" className="w-44 h-44 object-contain drop-shadow-2xl" />
        </motion.div>
      ) : (
        <Miko side="left" />
      )}

      <main className="relative z-10 mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-4 text-center text-3xl font-black text-white drop-shadow">⛩️ Miko Weather</h1>

        <form onSubmit={search} className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a city or region…"
            className="flex-1 rounded-full bg-white/80 px-4 py-2 outline-none placeholder:text-slate-500 text-black" />
          <button className="rounded-full bg-rose-500 px-5 font-bold text-white hover:bg-rose-600 shadow-md">Go</button>
        </form>

        {results.length > 0 && (
          <ul className="mt-2 overflow-hidden rounded-2xl bg-white/90 shadow text-black">
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
          {error && <p className="mt-4 text-red-200 drop-shadow">⚠️ {error}</p>}
          {!data && !error && <p className="mt-4 animate-pulse">Miko is asking the sky spirits…</p>}
          {cur && (
            <>
              <motion.div className="text-7xl" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                {KINDS[kind].icon}
              </motion.div>
              <div className="text-6xl font-black drop-shadow-md">{Math.round(cur.temperature_2m)}°C</div>
              <div className="text-xl drop-shadow-md">{KINDS[kind].label}</div>
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

        {/* --- NEW THEME CUSTOMIZER PANEL --- */}
        <div className="mt-8 rounded-3xl border border-white/40 bg-white/20 p-6 text-white shadow-xl backdrop-blur-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-center text-white/90 drop-shadow">Theme Customizer</h2>
          
          {/* Background Options */}
          <div className="mb-5">
            <span className="text-xs font-semibold block mb-2 opacity-90 drop-shadow">Background:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setBgImage("")} className={`px-3 py-1 text-xs rounded-lg font-medium transition shadow-md ${!bgImage ? 'bg-rose-500 text-white' : 'bg-white/30 hover:bg-white/50 text-white'}`}>Auto Weather</button>
              {PRESET_BGS.map((bg, idx) => (
                <button key={idx} onClick={() => setBgImage(bg)} className={`px-3 py-1 text-xs rounded-lg font-medium transition shadow-md ${bgImage === bg ? 'bg-rose-500 text-white' : 'bg-white/30 hover:bg-white/50 text-white'}`}>Bg {idx + 1}</button>
              ))}
              <label className="text-xs bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-lg cursor-pointer transition shadow-md">
                Upload
                <input type="file" accept="image/*" onChange={(e) => handleCustomUpload(e, 'bg')} className="hidden" />
              </label>
            </div>
          </div>

          {/* Sticker Options */}
          <div>
            <span className="text-xs font-semibold block mb-2 opacity-90 drop-shadow">Character:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setSticker("")} className={`px-3 py-1 text-xs rounded-lg font-medium transition shadow-md ${!sticker ? 'bg-rose-500 text-white' : 'bg-white/30 hover:bg-white/50 text-white'}`}>Auto Miko</button>
              {PRESET_STICKERS.map((stk, idx) => (
                <button key={idx} onClick={() => setSticker(stk)} className={`px-3 py-1 text-xs rounded-lg font-medium transition shadow-md ${sticker === stk ? 'bg-rose-500 text-white' : 'bg-white/30 hover:bg-white/50 text-white'}`}>Girl {idx + 1}</button>
              ))}
              <label className="text-xs bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-lg cursor-pointer transition shadow-md">
                Upload
                <input type="file" accept="image/*" onChange={(e) => handleCustomUpload(e, 'sticker')} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded-2xl bg-white/20 p-2 shadow-inner">
    <div className="opacity-80 drop-shadow-sm">{label}</div>
    <div className="font-bold drop-shadow-sm">{value}</div>
  </div>
);
