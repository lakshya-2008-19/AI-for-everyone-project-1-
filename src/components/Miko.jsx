import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETINGS = ["Hi! 👋", "Konnichiwa~!", "Hello, traveler!", "Nice weather? ☀️"];

export default function Miko({ side = "left" }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 800);
    const t2 = setInterval(() => setI((n) => (n + 1) % GREETINGS.length), 3500);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);

  return (
    <motion.div
      className={`fixed bottom-2 z-20 w-32 cursor-pointer select-none ${side === "left" ? "left-2" : "right-2"}`}
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: [0, -12, 0], opacity: 1 }}
      transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1 } }}
      whileHover={{ scale: 1.1, rotate: -4 }}
      whileTap={{ scale: 0.9, y: -40 }}
      onClick={() => setI((n) => (n + 1) % GREETINGS.length)}
    >
      <AnimatePresence mode="wait">
        {show && (
          <motion.div key={i}
            className="absolute -top-10 left-4 whitespace-nowrap rounded-2xl bg-white px-3 py-1 text-sm font-bold text-rose-500 shadow-lg"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
            {GREETINGS[i]}
          </motion.div>
        )}
      </AnimatePresence>

      <svg viewBox="0 0 120 150" className="drop-shadow-lg">
        <ellipse cx="60" cy="58" rx="40" ry="46" fill="#2b2140" />
        <path d="M32 100 L88 100 L100 148 L20 148 Z" fill="#e11d48" />
        <rect x="38" y="82" width="44" height="30" rx="10" fill="#fff" />
        <rect x="52" y="104" width="16" height="8" rx="3" fill="#e11d48" />
        <circle cx="60" cy="58" r="28" fill="#ffe4d6" />
        <path d="M32 55 Q60 20 88 55 Q75 38 60 42 Q45 38 32 55Z" fill="#2b2140" />
        <motion.g animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
          style={{ originY: 0.5 }}>
          <ellipse cx="49" cy="62" rx="4" ry="6" fill="#4c1d95" />
          <ellipse cx="71" cy="62" rx="4" ry="6" fill="#4c1d95" />
          <circle cx="50.5" cy="60" r="1.5" fill="#fff" />
          <circle cx="72.5" cy="60" r="1.5" fill="#fff" />
        </motion.g>
        <ellipse cx="42" cy="72" rx="5" ry="3" fill="#fda4af" opacity=".7" />
        <ellipse cx="78" cy="72" rx="5" ry="3" fill="#fda4af" opacity=".7" />
        <path d="M54 76 Q60 82 66 76" stroke="#be123c" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="34" cy="38" r="7" fill="#e11d48" /><circle cx="86" cy="38" r="7" fill="#e11d48" />
        <motion.g animate={{ rotate: [0, 35, -10, 35, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
          style={{ originX: 0.5, originY: 1 }}>
          <rect x="86" y="72" width="10" height="28" rx="5" fill="#fff" />
          <circle cx="91" cy="70" r="7" fill="#ffe4d6" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
