// barre che salgono e scendono mentre carica
const BondSpinner = ({ label = "Caricamento" }) => (
  <div role="status" className="grid flex-1 place-items-center py-24">
    <div className="flex h-10 items-end gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="sb-eq w-1.5 rounded-full bg-accent"
          style={{ animationDelay: `${i * -0.18}s` }}
        />
      ))}
    </div>
    <span className="sr-only">{label}</span>
  </div>
);

export default BondSpinner;
