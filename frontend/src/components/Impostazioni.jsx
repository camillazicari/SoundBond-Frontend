import ImpArtisti from "./ImpArtisti";
import ImpBrani from "./ImpBrani";
import ImpDelete from "./ImpDelete";
import ImpGeneri from "./ImpGeneri";
import ImpUser from "./ImpUser";
import PageHeader from "./ui/PageHeader.jsx";

const SECTIONS = [
  { id: "profilo", label: "Profilo", Component: ImpUser },
  { id: "generi", label: "Generi", Component: ImpGeneri },
  { id: "brani", label: "Brani", Component: ImpBrani },
  { id: "artisti", label: "Artisti", Component: ImpArtisti },
  { id: "account", label: "Account", Component: ImpDelete },
];

const Impostazioni = () => (
  <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-16 md:pt-15">
    <PageHeader eyebrow="Impostazioni" title="Il tuo" accent="profilo.">
      Cambia foto e bio, aggiorna i gusti: il match si ricalcola subito.
    </PageHeader>

    <div className="mt-12 grid gap-10 lg:grid-cols-[12rem_1fr]">
      <nav aria-label="Sezioni" className="lg:sticky lg:top-28 lg:self-start">
        <ul className="flex gap-1 overflow-x-auto lg:flex-col">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block rounded-full px-4 py-2 text-sm whitespace-nowrap text-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="grid gap-6">
        {SECTIONS.map(({ id, Component }) => (
          <section key={id} id={id} className="scroll-mt-28">
            <Component />
          </section>
        ))}
      </div>
    </div>
  </div>
);

export default Impostazioni;
