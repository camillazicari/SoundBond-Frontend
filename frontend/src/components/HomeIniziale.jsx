import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { calculateCompatibility } from "./data/matchMaking";
import SyncWaves from "./SyncWaves";
import { playlistCovers } from "../assets/playlistCovers";

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, delay = 0, className = "", y = 32 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

// Percentuale di sintonia: aggiornata direttamente nel DOM, senza re-render
function SyncCounter({ progress }) {
  const ref = useRef(null);
  useMotionValueEvent(progress, "change", (v) => {
    if (ref.current) ref.current.textContent = String(Math.round(v * 100));
  });
  return (
    <span ref={ref} className="tabular-nums">
      0
    </span>
  );
}

function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Scorrendo le due onde entrano in sintonia
  const raw = useTransform(scrollYProgress, [0.04, 0.72], [0, 1], { clamp: true });
  const spring = useSpring(raw, { stiffness: 110, damping: 28 });
  const still = useMotionValue(1);
  const progress = reduce ? still : spring;
  // ...e le due metà del nome si avvicinano, fino a formare un blocco unico
  const soundX = useTransform(progress, [0, 1], ["0vw", "9vw"]);
  const bondX = useTransform(progress, [0, 1], ["0vw", "-9vw"]);
  const outOfSync = useTransform(progress, [0.55, 0.85], [1, 0]);
  const inSync = useTransform(progress, [0.8, 1], [0, 1]);
  const inSyncY = useTransform(progress, [0.8, 1], [12, 0]);

  const intro = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay: 0.1 + i * 0.12, ease },
  });

  return (
    <section ref={ref} className={reduce ? "relative" : "relative h-[220vh]"}>
      <div className="sticky top-0 flex min-h-[100dvh] flex-col justify-between overflow-hidden px-4 pt-28 pb-8 md:pt-32">
        <h1 className="display relative mx-auto w-full max-w-7xl text-[clamp(5.5rem,19vw,17rem)] font-extrabold uppercase select-none">
          <motion.span {...intro(0)} className="block">
            <motion.span className="inline-block" style={{ x: soundX }}>
              Sound
            </motion.span>
          </motion.span>
          <motion.span {...intro(1)} className="block text-right text-accent">
            <motion.span className="inline-block" style={{ x: bondX }}>
              Bond
            </motion.span>
          </motion.span>
          <span className="sr-only">: la tua musica, le tue connessioni</span>
        </h1>

        <SyncWaves
          progress={progress}
          className="pointer-events-none relative -mx-4 h-36 w-[calc(100%+2rem)] max-w-none mix-blend-screen md:absolute md:inset-x-0 md:top-1/2 md:mx-0 md:h-[42vh] md:w-full md:-translate-y-[38%]"
        />

        <div className="relative mx-auto mt-4 grid w-full max-w-7xl items-end gap-8 md:mt-10 md:grid-cols-[1fr_auto]">
          <motion.div {...intro(2)}>
            <p className="max-w-md text-lg leading-relaxed text-fg/80">
              Due persone, due playlist. SoundBond misura quanto i vostri gusti
              sono in sintonia e vi mette in contatto.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/accedi/registrati" className="btn btn-primary group">
                Crea un account
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
              <Link to="/accedi" className="btn btn-ghost">
                Accedi
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...intro(3)}
            className="relative grid min-w-64 md:justify-items-end"
            aria-hidden="true"
          >
            <motion.p
              style={{ opacity: outOfSync }}
              className="display col-start-1 row-start-1 text-5xl font-bold text-muted md:text-6xl"
            >
              Fuori fase.
            </motion.p>
            <motion.p
              style={{ opacity: inSync, y: inSyncY }}
              className="display col-start-1 row-start-1 text-5xl font-bold md:text-6xl"
            >
              In <span className="text-accent">sintonia.</span>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const giulia = {
  generi: ["Pop", "Indie", "Rock"].map((nome) => ({ nome })),
  artisti: ["Arctic Monkeys", "Dua Lipa", "Måneskin"].map((nome) => ({ nome })),
};
const genreOptions = ["Pop", "Rock", "Indie", "Jazz", "Elettronica", "Hip Hop"];
const artistOptions = [
  "Arctic Monkeys",
  "Dua Lipa",
  "Måneskin",
  "Daft Punk",
  "Amy Winehouse",
];

function Toggle({ label, on, onClick, common }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-[background-color,border-color,color,transform] duration-200 active:scale-95 ${
        on
          ? common
            ? "border-accent bg-accent text-accent-ink"
            : "border-line-strong bg-white/[0.08] text-fg"
          : "border-line text-muted hover:text-fg"
      }`}
    >
      {on && <Check size={14} strokeWidth={2.5} />}
      {label}
    </button>
  );
}

function Simulator() {
  const reduce = useReducedMotion();
  const [generi, setGeneri] = useState(["Pop", "Jazz"]);
  const [artisti, setArtisti] = useState(["Dua Lipa", "Amy Winehouse"]);
  const toggle = (list, set) => (v) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  // Stessa funzione usata dall'app per la pagina Connessioni
  const result = useMemo(() => {
    if (!generi.length || !artisti.length) return { score: 0, details: {} };
    return calculateCompatibility(
      {
        generi: generi.map((nome) => ({ nome })),
        artisti: artisti.map((nome) => ({ nome })),
      },
      giulia
    );
  }, [generi, artisti]);

  const score = useMotionValue(0);
  const smooth = useSpring(score, { stiffness: 140, damping: 22 });
  const ring = useTransform(smooth, (v) => Math.max(0.001, v / 100));
  const ratio = useTransform(smooth, (v) => v / 100);
  useEffect(() => {
    if (reduce) smooth.jump(result.score);
    score.set(result.score);
  }, [result.score, score, smooth, reduce]);

  const commonG = result.details.commonGenres ?? [];
  const commonA = result.details.commonArtists ?? [];
  const isCommon = (list, v) => list.includes(v.toLowerCase());

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:py-32">
      <Reveal>
        <h2 className="display max-w-3xl text-5xl font-bold md:text-7xl">
          Prova a fare match con Giulia.
        </h2>
        <p className="mt-5 max-w-lg text-lg text-muted">
          Scegli i tuoi gusti. L&apos;affinità si calcola come nell&apos;app:
          generi in comune per il 60%, artisti per il 40%.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <div className="surface grid gap-10 p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-medium text-subtle">
                I tuoi generi
              </h3>
              <div className="flex flex-wrap gap-2">
                {genreOptions.map((g) => (
                  <Toggle
                    key={g}
                    label={g}
                    on={generi.includes(g)}
                    common={isCommon(commonG, g)}
                    onClick={() => toggle(generi, setGeneri)(g)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium text-subtle">
                I tuoi artisti
              </h3>
              <div className="flex flex-wrap gap-2">
                {artistOptions.map((a) => (
                  <Toggle
                    key={a}
                    label={a}
                    on={artisti.includes(a)}
                    common={isCommon(commonA, a)}
                    onClick={() => toggle(artisti, setArtisti)(a)}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-subtle">
              Giulia ascolta Pop, Indie e Rock, con Arctic Monkeys, Dua Lipa e
              Måneskin. In viola quello che avete in comune.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 border-t border-line pt-10 md:border-t-0 md:border-l md:pt-0 md:pl-10">
            <div className="relative grid size-56 place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-line-strong)" strokeWidth="3" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ pathLength: ring }}
                />
              </svg>
              <p className="display text-7xl font-bold" aria-live="polite">
                <SyncCounter progress={ratio} />
                <span className="text-[0.45em] text-accent">%</span>
              </p>
            </div>
            <dl className="grid w-full max-w-xs grid-cols-2 gap-4 text-center">
              <div>
                <dt className="text-xs text-subtle">Generi in comune</dt>
                <dd className="mt-1 font-mono text-lg">{commonG.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-subtle">Artisti in comune</dt>
                <dd className="mt-1 font-mono text-lg">{commonA.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Vinyl() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 420]);

  const steps = [
    {
      title: "Racconta cosa ascolti",
      text: "Generi, artisti e brani dal catalogo Deezer, con anteprima audio.",
    },
    {
      title: "Guarda chi ti somiglia",
      text: "Le persone sono ordinate per affinità. Quello che avete in comune è evidenziato.",
    },
    {
      title: "Parlatene",
      text: "Una richiesta accettata apre una chat privata in tempo reale.",
    },
  ];

  return (
    <section
      ref={ref}
      className="mx-auto grid max-w-7xl items-center gap-16 overflow-x-clip px-4 py-24 md:grid-cols-2 md:py-32"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
        <motion.div
          style={reduce ? undefined : { rotate }}
          className="vinyl absolute inset-0 rounded-full"
        >
          <img
            src={playlistCovers[3]}
            alt=""
            className="absolute inset-[33%] size-[34%] rounded-full object-cover"
          />
          <span className="absolute top-1/2 left-1/2 size-3 -translate-1/2 rounded-full bg-ink" />
        </motion.div>
        <div className="vinyl-sheen pointer-events-none absolute inset-0 rounded-full" />
      </div>

      <div>
        <Reveal>
          <h2 className="display text-5xl font-bold md:text-7xl">
            Gira così.
          </h2>
        </Reveal>
        <ol className="mt-12 space-y-10">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={0.08 * i}>
              <li className="border-l-2 border-accent/40 pl-6">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-sm text-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Covers() {
  return (
    <section aria-label="Playlist" className="-rotate-3 py-16">
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-[sb-marquee_70s_linear_infinite] gap-4 motion-reduce:animate-none">
          {[...playlistCovers, ...playlistCovers].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden={i >= playlistCovers.length}
              className="size-44 rounded-2xl object-cover md:size-56"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  const synced = useMotionValue(1);
  return (
    <section className="relative overflow-hidden px-4 py-32 text-center md:py-48">
      <SyncWaves
        progress={synced}
        className="pointer-events-none absolute inset-x-0 top-[42%] h-72 w-full -translate-y-1/2 opacity-50 mix-blend-screen md:h-[28rem]"
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <h2 className="display text-[clamp(2.75rem,12.5vw,12rem)] font-extrabold uppercase">
            Trova chi
            <br />
            suona{" "}
            <span className="whitespace-nowrap text-accent">come te.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="mt-12 flex flex-col items-center gap-5">
          <Link
            to="/accedi/registrati"
            className="btn btn-primary group px-10 py-5 text-lg md:text-xl"
          >
            Crea un account
            <ArrowRight
              size={22}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <p className="text-muted">
            Scegli i tuoi artisti e vedi subito con chi sei in sintonia.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const HomeIniziale = () => (
  <div className="-mt-[4.75rem] overflow-x-clip md:-mt-20">
    <Hero />
    <Simulator />
    <Vinyl />
    <Covers />
    <Closing />
  </div>
);

export default HomeIniziale;
