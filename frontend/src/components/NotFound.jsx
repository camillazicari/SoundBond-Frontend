import { Link } from "react-router-dom";
import { useMotionValue } from "motion/react";
import SyncWaves from "./SyncWaves";

/* 404: onde fuori fase, perché la pagina non è in sintonia con nulla */
const NotFound = () => {
  const offbeat = useMotionValue(0);
  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <SyncWaves progress={offbeat} className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-64 w-full -translate-y-1/2 opacity-30" />
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">Errore 404</p>
      <h1 className="display mt-4 text-[clamp(4rem,14vw,10rem)] font-extrabold uppercase">
        Fuori <span className="text-accent">fase.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">Questa pagina si è persa nella playlist. Riproviamo con un'altra traccia.</p>
      <Link to="/" className="btn btn-primary mt-10">Torna alla home</Link>
    </div>
  );
};

export default NotFound;
