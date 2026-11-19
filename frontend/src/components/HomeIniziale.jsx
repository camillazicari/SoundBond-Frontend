import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import SyncWaves from "./SyncWaves";
import { playlistCovers } from "../assets/playlistCovers";
import concert from "../assets/Concert Energy.jpeg";
import listener from "../assets/Silhouette with Headphones.jpeg";

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
  const raw = useTransform(scrollYProgress, [0.02, 0.75], [0, 1], {
    clamp: true,
  });
  const progress = useSpring(raw, { stiffness: 120, damping: 30 });
  const shiftLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);
  const shiftRight = useTransform(scrollYProgress, [0, 1], ["0%", "3%"]);

  const intro = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay: 0.1 + i * 0.12, ease },
  });

  return (
    <section ref={ref} className={reduce ? "relative" : "relative h-[230vh]"}>
      <div className="sticky top-0 flex min-h-[100dvh] flex-col justify-between overflow-hidden px-4 pt-28 pb-8 md:pt-32">
        <h1 className="display relative mx-auto w-full max-w-7xl text-[clamp(5.5rem,19vw,17rem)] font-extrabold uppercase select-none">
          <motion.span
            {...intro(0)}
            style={reduce ? undefined : { x: shiftLeft }}
            className="block"
          >
            Sound
          </motion.span>
          <motion.span
            {...intro(1)}
            style={reduce ? undefined : { x: shiftRight }}
            className="block text-right text-accent"
          >
            Bond
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

          <motion.div {...intro(3)} className="md:text-right">
            <p className="display text-7xl font-bold text-fg md:text-8xl">
              {reduce ? "100" : <SyncCounter progress={progress} />}
              <span className="text-accent">%</span>
            </p>
            <div className="mt-2 flex gap-5 text-sm text-muted md:justify-end">
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-6 rounded-full bg-accent" />
                i tuoi gusti
              </span>
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-6 rounded-full bg-fg/80" />
                i suoi
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Formula() {
  return (
    <section className="px-4 py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-accent px-6 py-14 text-accent-ink md:px-14 md:py-20">
        <Reveal>
          <h2 className="display max-w-3xl text-5xl font-bold md:text-7xl">
            Il match non è magia. È una formula.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-6">
          <Reveal delay={0.1}>
            <p className="display text-[clamp(7rem,20vw,15rem)] leading-[0.8] font-extrabold">
              60
              <span className="text-[0.4em]">%</span>
            </p>
            <p className="mt-4 max-w-sm text-lg font-medium">
              generi in comune, rispetto alla lista più lunga tra le due.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="md:mt-28">
            <p className="display text-[clamp(5rem,13vw,10rem)] leading-[0.8] font-extrabold">
              40
              <span className="text-[0.4em]">%</span>
            </p>
            <p className="mt-4 max-w-xs text-lg font-medium">
              artisti in comune. La somma è la vostra affinità.
            </p>
          </Reveal>
        </div>
      </div>
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
      <div className="relative mx-auto aspect-square w-full max-w-[34rem] md:-ml-24">
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
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 md:py-40">
      <div className="grid items-end gap-12 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h2 className="display text-6xl font-bold md:text-8xl">
            Chi ascolta quello che ascolti tu?
          </h2>
          <Link to="/accedi/registrati" className="btn btn-primary mt-10">
            Crea un account
          </Link>
        </Reveal>
        <Reveal delay={0.15} className="relative hidden h-96 md:block">
          <img
            src={concert}
            alt=""
            className="absolute top-0 right-16 h-72 w-56 -rotate-6 rounded-3xl object-cover shadow-2xl shadow-black/60"
          />
          <img
            src={listener}
            alt=""
            className="absolute right-0 bottom-0 h-64 w-52 rotate-6 rounded-3xl border border-line object-cover shadow-2xl shadow-black/60"
          />
        </Reveal>
      </div>
    </section>
  );
}

const HomeIniziale = () => (
  <div className="-mt-[4.75rem] overflow-x-clip md:-mt-20">
    <Hero />
    <Formula />
    <Vinyl />
    <Covers />
    <Closing />
  </div>
);

export default HomeIniziale;
