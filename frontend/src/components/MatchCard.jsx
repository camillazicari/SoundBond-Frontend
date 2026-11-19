import { API_URL } from "../config";
import { Pause, Play } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./personalizedComponents/Avatar.jsx";

export const profileImage = (immagine) =>
  !immagine
    ? undefined
    : immagine.startsWith("http")
    ? immagine
    : `${API_URL}${immagine}`;

const initials = (text = "") => text.slice(0, 2).toUpperCase();

// Affinità: numero grande, colore pieno solo sopra il 40%
export function Affinity({ score = 0, size = "lg" }) {
  const strong = score >= 40;
  return (
    <div className="text-right">
      <p
        className={`font-mono leading-none font-semibold tracking-tight ${
          size === "lg" ? "text-3xl" : "text-xl"
        } ${strong ? "text-accent" : "text-muted"}`}
      >
        {score}
        <span className="text-[0.6em]">%</span>
      </p>
      <p className="mt-1 text-xs text-subtle">affinità</p>
    </div>
  );
}

export function UserHeader({ user, score, size = "lg" }) {
  const avatarSize = size === "lg" ? "size-14" : "size-12";
  return (
    <div className="flex items-start gap-4">
      <Avatar className={`${avatarSize} shrink-0 ring-1 ring-line-strong`}>
        <AvatarImage
          src={profileImage(user?.profilo?.immagine)}
          alt=""
          className="object-cover"
        />
        <AvatarFallback className="bg-accent-soft text-sm font-semibold text-accent">
          {initials(user?.nome)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold">
          {user?.nome} {user?.cognome}
        </p>
        <p className="truncate text-sm text-muted">@{user?.nomeUtente}</p>
        {user?.profilo?.bio && size === "lg" && (
          <p className="mt-1 line-clamp-1 text-sm text-subtle">
            {user.profilo.bio}
          </p>
        )}
      </div>
      {typeof score === "number" && <Affinity score={score} size={size} />}
    </div>
  );
}

const isCommon = (list, value) => list?.includes(value?.toLowerCase());

export default function MatchCard({
  match,
  actions,
  onSongClick,
  playingTitle,
}) {
  const { user, compatibility } = match;
  const details = compatibility?.details ?? {};
  const shared = [
    ...(user?.generi ?? [])
      .filter((g) => isCommon(details.commonGenres, g.nome))
      .map((g) => g.nome),
    ...(user?.artisti ?? [])
      .filter((a) => isCommon(details.commonArtists, a.nome))
      .map((a) => a.nome),
  ];

  return (
    <article className="surface flex h-full flex-col p-6">
      <UserHeader user={user} score={compatibility?.score} />

      {shared.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-subtle">In comune</span>
          {shared.map((name) => (
            <span
              key={name}
              className="chip border-accent/25 bg-accent-soft text-fg"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      {user?.artisti?.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-3 text-xs font-medium text-subtle">Artisti</h3>
          <ul className="flex gap-4 overflow-x-auto pb-1">
            {user.artisti.map((artista) => (
              <li key={artista.id} className="w-16 shrink-0 text-center">
                <Avatar
                  className={`mx-auto size-14 ${
                    isCommon(details.commonArtists, artista.nome)
                      ? "ring-2 ring-accent ring-offset-2 ring-offset-surface"
                      : "ring-1 ring-line"
                  }`}
                >
                  <AvatarImage
                    src={artista.img}
                    alt=""
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-surface-3 text-xs">
                    {initials(artista.nome)}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-2 line-clamp-2 text-xs leading-tight text-muted">
                  {artista.nome}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {user?.brani?.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-2 text-xs font-medium text-subtle">Brani</h3>
          <ul className="-mx-2 max-h-44 overflow-y-auto">
            {user.brani.map((brano) => {
              const playing = playingTitle === brano.titolo;
              return (
                <li
                  key={brano.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                >
                  <img
                    src={brano.img}
                    alt=""
                    className="size-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {brano.titolo}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {brano.artista}
                    </p>
                  </div>
                  {onSongClick && (
                    <button
                      type="button"
                      aria-label={
                        playing
                          ? `Metti in pausa ${brano.titolo}`
                          : `Ascolta l'anteprima di ${brano.titolo}`
                      }
                      onClick={() => onSongClick(brano.titolo, brano.artista)}
                      className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-[transform,background-color] active:scale-90 ${
                        playing
                          ? "bg-accent text-accent-ink"
                          : "bg-white/[0.06] text-fg hover:bg-white/[0.1]"
                      }`}
                    >
                      {playing ? (
                        <Pause size={15} fill="currentColor" />
                      ) : (
                        <Play size={15} fill="currentColor" className="ml-0.5" />
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {user?.generi?.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-2 text-xs font-medium text-subtle">Generi</h3>
          <div className="flex flex-wrap gap-1.5">
            {user.generi.map((genere) => (
              <span
                key={genere.id}
                className={`chip ${
                  isCommon(details.commonGenres, genere.nome)
                    ? "border-accent/25 bg-accent-soft text-fg"
                    : ""
                }`}
              >
                {genere.nome}
              </span>
            ))}
          </div>
        </section>
      )}

      {actions && (
        <>
          <div className="min-h-6 flex-1" />
          <div className="flex gap-2 border-t border-line pt-5">{actions}</div>
        </>
      )}
    </article>
  );
}
