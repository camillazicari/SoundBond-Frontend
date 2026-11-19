import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import SyncWaves from "./SyncWaves";

const STEPS = ["Generi", "Artisti", "Brani"];

// onboarding in 3 passi: le onde si uniscono man mano che scegli
export default function OnboardingLayout({
  step,
  name,
  title,
  accent,
  intro,
  count,
  max,
  error,
  cta = "Continua",
  onNext,
  children,
}) {
  const progress = Math.min(1, (step - 1 + Math.min(count, max) / max) / STEPS.length);
  const raw = useMotionValue(progress);
  const synced = useSpring(raw, { stiffness: 90, damping: 22 });
  useEffect(() => raw.set(progress), [progress, raw]);

  return (
    <div className="relative isolate flex flex-1 flex-col">
      <SyncWaves
        progress={synced}
        className="pointer-events-none fixed inset-x-0 bottom-16 -z-10 hidden h-48 w-full opacity-30 md:block"
      />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 pt-12 pb-36 md:pt-15">
        <ol className="mb-10 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em]">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const state = n < step ? "done" : n === step ? "current" : "todo";
            return (
              <li key={label} className="flex items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
                <span
                  className={`grid size-6 place-items-center rounded-full border ${
                    state === "todo"
                      ? "border-line-strong text-subtle"
                      : "border-accent bg-accent text-accent-ink"
                  }`}
                >
                  {n}
                </span>
                <span className={state === "current" ? "text-fg" : "text-subtle"}>{label}</span>
                {n < STEPS.length && <span className="mx-1 h-px w-6 bg-line-strong md:w-10" />}
              </li>
            );
          })}
        </ol>

        {name && <p className="mb-3 text-muted">Ciao {name},</p>}
        <h1 className="display text-[clamp(2.75rem,7vw,5.5rem)] font-bold">
          {title} <span className="text-accent">{accent}</span>
        </h1>
        {intro && <p className="mt-5 max-w-xl text-lg text-muted">{intro}</p>}

        <div className="mt-10">{children}</div>
      </div>

      <div className="glass fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full py-2 pr-2 pl-6">
        <p className="text-sm text-muted" aria-live="polite">
          {error ? (
            <span className="text-rose-300">{error}</span>
          ) : (
            <>
              <span className="font-mono text-fg">{count}</span>
              <span className="font-mono"> / {max}</span>
              <span className="hidden sm:inline"> selezionati</span>
            </>
          )}
        </p>
        <button type="button" onClick={onNext} className="btn btn-primary">
          {cta}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
