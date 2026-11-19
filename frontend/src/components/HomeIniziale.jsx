import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Headphones, MessageCircle, Sparkles } from "lucide-react";
import concert from "../assets/Concert Energy.jpeg";
import vinyl from "../assets/Vinyl Records in Neon.jpeg";
import listener from "../assets/Silhouette with Headphones.jpeg";
import dancing from "../assets/Dancing Woman in Nightclub.jpeg";
import { playlistCovers } from "../assets/playlistCovers";

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

// Anteprima della card di compatibilità, con gli stessi elementi della pagina Connessioni
function MatchPreview() {
  const shared = ["Arctic Monkeys", "Måneskin", "Indie"];
  return (
    <div className="glass w-72 rounded-3xl p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
          GR
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Giulia Rossi</p>
          <p className="text-xs text-muted">@giulia.demo</p>
        </div>
        <span className="font-mono text-lg font-semibold text-accent">67%</span>
      </div>
      <p className="mt-4 mb-2 text-xs text-subtle">In comune</p>
      <div className="flex flex-wrap gap-1.5">
        {shared.map((s) => (
          <span key={s} className="chip text-fg">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

const steps = [
  {
    icon: Headphones,
    title: "Racconta cosa ascolti",
    text: "Scegli generi, artisti e brani preferiti. La ricerca usa il catalogo Deezer, con anteprime audio.",
    img: vinyl,
  },
  {
    icon: Sparkles,
    title: "Trova chi ti somiglia",
    text: "Ogni profilo riceve una percentuale di compatibilità basata su generi e artisti in comune.",
    img: listener,
  },
  {
    icon: MessageCircle,
    title: "Parlane in chat",
    text: "Quando una richiesta viene accettata si apre una chat privata in tempo reale.",
    img: dancing,
  },
];

const HomeIniziale = () => {
  const reduce = useReducedMotion();
  const stagger = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.08 * i, ease },
  });

  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-20 md:grid-cols-[1.2fr_1fr] md:pt-20 lg:gap-16">
        <div>
          <motion.h1
            {...stagger(0)}
            className="text-5xl leading-[1.02] font-semibold tracking-[-0.04em] md:text-6xl lg:text-[4.5rem]"
          >
            La tua musica,
            <br />
            <span className="text-accent whitespace-nowrap">le tue connessioni.</span>
          </motion.h1>
          <motion.p
            {...stagger(1)}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted"
          >
            SoundBond confronta i tuoi gusti con quelli degli altri e ti
            presenta le persone con cui hai più musica in comune.
          </motion.p>
          <motion.div {...stagger(2)} className="mt-9 flex flex-wrap gap-3">
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
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line md:aspect-[5/6]">
            <img
              src={concert}
              alt="Pubblico a un concerto con le luci del palco"
              className="size-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.8, delay: 0.55 }}
            className="absolute -bottom-8 left-4 md:-left-10"
          >
            <MatchPreview />
          </motion.div>
        </motion.div>
      </section>

      {/* Come funziona: mosaico asimmetrico */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
            Dai gusti musicali a una conversazione, in tre passaggi.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 md:grid-rows-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const large = i === 0;
            return (
              <Reveal
                key={step.title}
                delay={0.06 * i}
                className={large ? "md:row-span-2" : ""}
              >
                <article
                  className={`group surface relative flex h-full flex-col overflow-hidden ${
                    large ? "min-h-[28rem]" : "min-h-64"
                  }`}
                >
                  <img
                    src={step.img}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-45 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/10" />
                  <div className="relative mt-auto p-6 md:p-8">
                    <span className="mb-4 grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <h3 className="text-xl font-semibold md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-muted">{step.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Copertine: unico elemento in movimento continuo della pagina */}
      <section aria-label="Playlist" className="py-10">
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-[sb-marquee_70s_linear_infinite] gap-4 motion-reduce:animate-none">
            {[...playlistCovers, ...playlistCovers].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                aria-hidden={i >= playlistCovers.length}
                className="size-40 rounded-2xl object-cover md:size-48"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Chiusura */}
      <section className="mx-auto max-w-6xl px-4 py-24 md:py-32">
        <Reveal className="surface flex flex-col items-start gap-8 p-8 md:flex-row md:items-end md:justify-between md:p-14">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              Chi ascolta quello che ascolti tu?
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Bastano pochi minuti per impostare i tuoi gusti e vedere i
              primi match.
            </p>
          </div>
          <Link to="/accedi/registrati" className="btn btn-primary">
            Crea un account
          </Link>
        </Reveal>
      </section>
    </div>
  );
};

export default HomeIniziale;
