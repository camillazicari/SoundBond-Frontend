import { Link, useLocation } from "react-router-dom";
import { BsGithub, BsInstagram } from "react-icons/bs";
import Logo from "./Logo";

export function Footer() {
  const location = useLocation();
  const hidden =
    location.pathname.startsWith("/chat") ||
    ["/generi", "/artisti", "/brani"].includes(location.pathname);
  if (hidden) return null;

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Link to="/" aria-label="SoundBond, home">
            <Logo />
          </Link>
          <p className="text-sm text-subtle">
            Progetto di Camilla Zicari. Dati musicali forniti da Deezer.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/camillazicari"
            aria-label="GitHub"
            className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            <BsGithub size={18} />
          </a>
          <a
            href="https://www.instagram.com/camiuzinwonderland/"
            aria-label="Instagram"
            className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
          >
            <BsInstagram size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
