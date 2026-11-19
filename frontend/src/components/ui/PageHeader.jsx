/* Intestazione di pagina: occhiello, titolo display, sottotitolo, azioni a destra */
export default function PageHeader({ eyebrow, title, accent, children, actions }) {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-subtle">
            {eyebrow}
          </p>
        )}
        <h1 className="display text-[clamp(2.75rem,7vw,5.5rem)] font-bold">
          {title}
          {accent && <span className="text-accent"> {accent}</span>}
        </h1>
        {children && <p className="mt-5 max-w-xl text-lg text-muted">{children}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
