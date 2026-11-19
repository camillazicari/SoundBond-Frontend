import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";
import SyncWaves from "./SyncWaves";

// layout di accedi e registrati: le onde si uniscono mentre compili
export default function AuthLayout({ eyebrow, title, accent, intro, progress = 0, aside, children }) {
  const raw = useMotionValue(progress);
  const synced = useSpring(raw, { stiffness: 90, damping: 22 });
  useEffect(() => raw.set(progress), [progress, raw]);

  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 pt-12 pb-16 md:pt-15 lg:items-start lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
      <div className="flex flex-col">
        {eyebrow && (
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-subtle">{eyebrow}</p>
        )}
        <h1 className="display text-[clamp(2.75rem,6vw,4.5rem)] font-bold">
          {title}
          {accent && (
            <>
              <br />
              <span className="text-accent">{accent}</span>
            </>
          )}
        </h1>
        {intro && <p className="mt-5 text-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>

      <aside
        aria-hidden="true"
        className="surface relative hidden h-[min(40rem,calc(100dvh-8rem))] overflow-hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:justify-between"
      >
        <div className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-accent/20 blur-[120px]" />
        <p className="relative p-8 font-mono text-xs uppercase tracking-[0.18em] text-subtle">
          Sintonia del profilo
        </p>
        <SyncWaves progress={synced} className="relative h-72 w-full" />
        <div className="relative p-8">{aside}</div>
      </aside>
    </div>
  );
}
