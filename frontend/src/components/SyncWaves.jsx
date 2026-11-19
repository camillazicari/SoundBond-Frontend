import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/*
  Due forme d'onda, una per persona. `progress` (MotionValue 0..1) le porta
  in sintonia: a 0 hanno frequenza e fase diverse, a 1 coincidono.
  I path vengono aggiornati fuori dal ciclo di render di React.
*/
const W = 1600;
const H = 420;
const N = 180;
const lerp = (a, b, t) => a + (b - a) * t;

function buildPath(t, p, which, energy) {
  const f1 = 3.2;
  const f = which === 0 ? f1 : lerp(f1 * 1.75, f1, p);
  const phase = which === 0 ? 0 : lerp(2.6, 0, p);
  const amp = H * 0.34 * (0.75 + energy * 0.35);
  let d = "";
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const env = Math.pow(Math.sin(Math.PI * u), 1.4);
    const wobble = 0.12 * Math.sin(2 * Math.PI * u * 9 + t * 2.1);
    const y =
      H / 2 +
      amp * env * (Math.sin(2 * Math.PI * u * f - t * 1.3 + phase) + wobble * (1 - p));
    d += `${i === 0 ? "M" : "L"}${(u * W).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export default function SyncWaves({ progress, className = "" }) {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const glowRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const draw = (t, p, e) => {
      const a = buildPath(t, p, 0, e);
      const b = buildPath(t, p, 1, e);
      aRef.current?.setAttribute("d", a);
      bRef.current?.setAttribute("d", b);
      glowRef.current?.setAttribute("d", b);
      if (glowRef.current) glowRef.current.style.opacity = String(p * p);
    };

    if (reduce) {
      draw(0, 1, 0);
      return;
    }

    let energy = 0;
    let target = 0;
    let last = performance.now();
    let t = 0;
    let raf;
    const onMove = (ev) => {
      target = Math.min(1, Math.abs(ev.movementX) / 30 + Math.abs(ev.movementY) / 30);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      energy += (target - energy) * 0.08;
      target *= 0.94;
      draw(t, progress.get(), energy);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [progress, reduce]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <filter id="wave-glow" x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <path
        ref={glowRef}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="16"
        filter="url(#wave-glow)"
        opacity="0"
      />
      <path
        ref={bRef}
        fill="none"
        stroke="var(--color-fg)"
        strokeOpacity="0.85"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        ref={aRef}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
