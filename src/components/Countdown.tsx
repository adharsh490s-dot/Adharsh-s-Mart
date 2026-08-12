import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Countdown({ hours = 8, className }: { hours?: number; className?: string }) {
  const [left, setLeft] = useState(hours * 3600);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s <= 1 ? hours * 3600 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [hours]);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <span className={className} suppressHydrationWarning>
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
