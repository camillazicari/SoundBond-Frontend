import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { getBonders } from "../redux/actions/bonders.js";
import BondSpinner from "./BondSpinner";
import PageHeader from "./ui/PageHeader.jsx";
import { profileImage } from "./MatchCard.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "./personalizedComponents/Avatar";

const Bonders = () => {
  const dispatch = useDispatch();
  const bonders = useSelector((state) => state.bonders.bonders);

  useEffect(() => {
    dispatch(getBonders());
  }, [dispatch]);

  if (bonders === undefined) return <BondSpinner />;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-16 md:pt-15">
      <PageHeader eyebrow="Bonders" title="Le persone" accent="in sintonia con te.">
        Chi ha accettato il tuo bond, o tu il suo. Scrivigli o guarda cosa ascolta.
      </PageHeader>

      {bonders?.length > 0 ? (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bonders.map(({ otherUser: b }) => (
            <li key={b.id} className="surface relative isolate flex flex-col overflow-hidden p-6">
              {b.artisti?.[0]?.img && (
                <div aria-hidden="true" className="ambient pointer-events-none absolute -inset-x-16 -top-32 -z-10 h-80 opacity-50">
                  <div className="flex h-full scale-110 blur-[60px] saturate-[1.8]">
                    {b.artisti.slice(0, 3).map((a) => (
                      <img key={a.id} src={a.img} alt="" className="h-full flex-1 object-cover" />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Avatar className="size-16 ring-1 ring-line-strong">
                  <AvatarImage src={profileImage(b?.profilo?.immagine)} alt="" className="object-cover" />
                  <AvatarFallback className="bg-accent-soft font-semibold text-accent">{b.nome?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="display truncate text-2xl font-bold">{b.nome} {b.cognome}</h2>
                  <p className="truncate text-sm text-muted">@{b.nomeUtente}</p>
                </div>
              </div>
              {b.profilo?.bio && <p className="mt-4 line-clamp-2 text-sm text-muted">{b.profilo.bio}</p>}
              <div className="flex-1" />
              <div className="mt-6 flex gap-2">
                <Link to={`/chat/${b.id}`} className="btn btn-primary flex-1">
                  <MessageCircle size={17} /> Scrivi
                </Link>
                <Link to={`/dettagli/${b.id}`} className="btn btn-ghost flex-1">Profilo</Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="surface mt-12 px-6 py-16 text-center">
          <p className="display text-3xl font-bold">Nessun bonder, per ora.</p>
          <p className="mt-2 text-muted">Manda una richiesta a qualcuno dalle connessioni.</p>
          <Link to="/connessioni" className="btn btn-primary mt-8">Trova connessioni</Link>
        </div>
      )}
    </div>
  );
};

export default Bonders;
