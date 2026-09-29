import { useMemo } from "react";
import { motion } from "framer-motion";

export default function Sky({ kind, isDay }) {
  const items = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 6 + Math.random() * 12,
        delay: Math.random() * 6,
        dur: 4 + Math.random() * 6,
      })),
    []
  );

  const mode = !isDay ? "stars" : kind === "rain" || kind === "storm" ? "rain" : kind === "snow" ? "snow" : "sakura";

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {items.map((p) => {
        if (mode === "stars")
          return (
            <motion.span key={p.id} className="absolute rounded-full bg-white"
              style={{ left: `${p.x}%`, top: `${(p.id * 7) % 90}%`, width: p.size / 3, height: p.size / 3 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2 + p.delay / 2, repeat: Infinity }} />
          );
        const rain = mode === "rain";
        return (
          <motion.span key={p.id}
            className={rain ? "absolute w-[2px] bg-blue-100/70" : "absolute rounded-full"}
            style={{
              left: `${p.x}%`, top: -30,
              height: rain ? p.size * 2 : p.size,
              width: rain ? 2 : p.size,
              background: rain ? undefined : mode === "snow" ? "#fff" : "#fbcfe8",
              borderRadius: mode === "sakura" ? "80% 0 80% 0" : undefined,
            }}
            animate={{ y: "110vh", x: rain ? 0 : [0, 30, -30, 0], rotate: rain ? 0 : 360 }}
            transition={{ duration: rain ? p.dur / 4 : p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }} />
        );
      })}
    </div>
  );
}
