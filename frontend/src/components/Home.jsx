/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMotionValue } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import BondSpinner from "./BondSpinner";
import RecommendedPlaylists from "./RecommendedPlaylists";
import SyncWaves from "./SyncWaves";
import { Affinity, profileImage } from "./MatchCard";
import { Avatar, AvatarFallback, AvatarImage } from "./personalizedComponents/Avatar";
import { useGetUserMatches } from "./data/matchMaking.js";
import { getUtenteLoggato, getUtenti } from "../redux/actions/account.js";
import { getBonders } from "../redux/actions/bonders.js";

const initials = (t = "") => t.slice(0, 2).toUpperCase();

function Person({ user, className = "size-14" }) {
  return (
    <Avatar className={`${className} shrink-0 ring-1 ring-line-strong`}>
      <AvatarImage src={profileImage(user?.profilo?.immagine)} alt="" className="object-cover" />
      <AvatarFallback className="bg-accent-soft font-semibold text-accent">{initials(user?.nome)}</AvatarFallback>
    </Avatar>
  );
}

function BestMatch({ match }) {
  const { user, compatibility } = match;
  const synced = useMotionValue(compatibility.score / 100);
  const shared = [...(compatibility.details.commonArtists ?? []), ...(compatibility.details.commonGenres ?? [])];
  return (
    <Link
      to="/connessioni"
      className="surface group relative isolate flex min-h-[22rem] flex-col justify-between overflow-hidden p-6 transition-colors hover:border-line-strong md:p-8 lg:col-span-2"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">Il tuo match migliore</p>
        <ArrowUpRight className="text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
      </div>
      <SyncWaves progress={synced} className="pointer-events-none -mx-6 my-4 h-28 w-[calc(100%+3rem)] opacity-70 md:-mx-8 md:h-36 md:w-[calc(100%+4rem)]" />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <Person user={user} className="size-16" />
          <div className="min-w-0">
            <p className="display text-3xl font-bold md:text-4xl">
              {user.nome} {user.cognome}
            </p>
            <p className="text-muted">@{user.nomeUtente}</p>
          </div>
        </div>
        <p className="display text-[clamp(4.5rem,10vw,8rem)] font-bold text-accent">
          {compatibility.score}
          <span className="text-[0.4em]">%</span>
        </p>
      </div>
      {shared.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="mr-1 self-center text-xs text-subtle">In comune</span>
          {shared.slice(0, 6).map((n) => (
            <span key={n} className="chip border-accent/25 bg-accent-soft capitalize text-fg">{n}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

function MiniMatch({ match }) {
  const { user, compatibility } = match;
  return (
    <li>
      <Link to="/connessioni" className="surface flex h-full flex-col gap-5 p-5 transition-colors hover:border-line-strong">
        <div className="flex items-start gap-3">
          <Person user={user} className="size-12" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{user.nome} {user.cognome}</p>
            <p className="truncate text-sm text-muted">@{user.nomeUtente}</p>
          </div>
          <Affinity score={compatibility.score} size="sm" />
        </div>
        {user.artisti?.length > 0 && (
          <div className="mt-auto flex items-center gap-3">
            <div className="flex -space-x-2">
              {user.artisti.slice(0, 4).map((a) => (
                <img key={a.id} src={a.img} alt="" className="size-8 rounded-full object-cover ring-2 ring-surface" />
              ))}
            </div>
            <p className="truncate text-sm text-subtle">{user.artisti.map((a) => a.nome).slice(0, 2).join(", ")}</p>
          </div>
        )}
      </Link>
    </li>
  );
}

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.userLogged);
  const users = useSelector((state) => state.account.users);
  const bonders = useSelector((state) => state.bonders.bonders);
  const loginSuccess = useSelector((state) => state.account.loginSuccess);
  const matches = useGetUserMatches();

  useEffect(() => {
    if (loginSuccess) dispatch(getUtenteLoggato());
  }, [loginSuccess]);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUtenti());
      dispatch(getBonders());
    }
  }, [user]);

  const candidates = useMemo(() => {
    const ids = new Set((bonders ?? []).map((b) => b.otherUser?.id));
    return matches.filter((m) => !ids.has(m.user.id));
  }, [matches, bonders]);

  if (!user || users.length === 0) return <BondSpinner />;

  const [best, ...rest] = candidates;
  const strong = candidates.filter((m) => m.compatibility.score >= 70).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-16 md:pt-15">
      <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-subtle">La tua sintonia di oggi</p>
          <h1 className="display text-[clamp(3rem,8vw,6.5rem)] font-bold">
            Ciao, <span className="text-accent">{user.nome}.</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/esplora" className="btn btn-ghost">Scopri musica</Link>
          <Link to="/connessioni" className="btn btn-primary">
            Trova connessioni <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      <section className="mt-12 grid gap-4 lg:grid-cols-3" aria-label="Riepilogo">
        {best ? (
          <BestMatch match={best} />
        ) : (
          <div className="surface grid place-items-center p-8 text-muted lg:col-span-2">Nessun nuovo match per ora.</div>
        )}
        <dl className="surface flex flex-col divide-y divide-line">
          {[
            ["Bonders", bonders?.length ?? 0, "/bonders"],
            ["Match sopra il 70%", strong, "/connessioni"],
            ["Persone da scoprire", candidates.length, "/connessioni"],
          ].map(([label, value, to]) => (
            <Link key={label} to={to} className="group flex flex-1 items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.03]">
              <dt className="text-muted">{label}</dt>
              <dd className="display text-5xl font-bold tabular-nums">{value}</dd>
            </Link>
          ))}
          {user.generi?.length > 0 && (
            <div className="p-6">
              <p className="mb-3 text-sm text-subtle">I tuoi generi</p>
              <div className="flex flex-wrap gap-1.5">
                {user.generi.map((g) => <span key={g.id} className="chip">{g.nome}</span>)}
              </div>
            </div>
          )}
        </dl>
      </section>

      {rest.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="display text-4xl font-bold md:text-5xl">Potenziali match</h2>
            <Link to="/connessioni" className="text-sm font-medium text-muted transition-colors hover:text-fg">Vedi tutti</Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 6).map((m) => <MiniMatch key={m.user.id} match={m} />)}
          </ul>
        </section>
      )}

      <RecommendedPlaylists />
    </div>
  );
};

export default Home;
