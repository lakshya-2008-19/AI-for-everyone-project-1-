import { useState } from "react";
import { motion } from "framer-motion";

const FORTUNES = {
  clear: { rank: "大吉 Great Blessing", tip: "The sun kami smile on you. Start something new today!", item: "Sunglasses" },
  cloud: { rank: "中吉 Middle Blessing", tip: "Calm skies bring calm minds. Good day for studying.", item: "A light jacket" },
  fog: { rank: "小吉 Small Blessing", tip: "Mist hides the path, but patience reveals it.", item: "A warm drink" },
  rain: { rank: "末吉 Future Blessing", tip: "Rain washes away worries. Enjoy a cozy day.", item: "A clear umbrella" },
  snow: { rank: "吉 Blessing", tip: "Quiet snow, quiet heart. Wrap up and wander.", item: "Warm gloves" },
  storm: { rank: "凶 Stay-Home Omen", tip: "The thunder spirits are loud. Stay in and code!", item: "Headphones" },
};

export default function Omikuji({ kind, temp }) {
  const [open, setOpen] = useState(false);
  const f = FORTUNES[kind];
  const outfit = temp >= 30 ? "Light & breezy 👕" : temp >= 20 ? "T-shirt & jeans 👖" : temp >= 10 ? "Hoodie 🧥" : "Heavy coat 🧣";

  return (
    <div className="mt-4 [perspective:800px]">
      <motion.div
        onClick={() => setOpen(!open)}
        className="relative mx-auto h-44 w-full max-w-sm cursor-pointer"
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ duration: 0.7 }}
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-rose-500 text-white shadow-xl [backface-visibility:hidden]">
          <span className="text-4xl">⛩️</span>
          <span className="font-black">Tap to draw Miko's Omikuji</span>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-amber-50 p-4 text-center text-rose-700 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="text-2xl font-black">{f.rank}</div>
          <p className="mt-1 text-sm">{f.tip}</p>
          <p className="mt-2 text-xs font-bold">Lucky item: {f.item} · Outfit: {outfit}</p>
        </div>
      </motion.div>
    </div>
  );
}
