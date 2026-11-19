import { forwardRef, useId } from "react";

// input con etichetta ed errore
const Field = forwardRef(function Field(
  { label, hint, error, className = "", id, children, ...props },
  ref
) {
  const auto = useId();
  const fieldId = id ?? auto;
  const describedBy = error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={fieldId} className="text-sm font-medium text-muted">
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`h-12 w-full rounded-xl border bg-white/[0.03] px-4 text-[0.9375rem] text-fg placeholder:text-subtle transition-[border-color,background-color,box-shadow] duration-200 outline-none hover:bg-white/[0.05] focus:border-accent/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-accent/15 [color-scheme:dark] ${
          error ? "border-rose-400/60" : "border-line-strong"
        }`}
        {...props}
      />
      {children}
      {error ? (
        <p id={`${fieldId}-err`} className="text-sm text-rose-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-sm text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Field;
