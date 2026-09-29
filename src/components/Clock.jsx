import { useEffect, useState } from "react";

export default function Clock({ timeZone }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const opts = timeZone ? { timeZone } : {};
  return (
    <div className="text-center text-white drop-shadow">
      <div className="text-5xl font-black tabular-nums">
        {now.toLocaleTimeString("en-GB", { ...opts, hour12: false })}
      </div>
      <div className="opacity-90">
        {now.toLocaleDateString("en-US", { ...opts, weekday: "long", month: "long", day: "numeric" })}
      </div>
    </div>
  );
}
