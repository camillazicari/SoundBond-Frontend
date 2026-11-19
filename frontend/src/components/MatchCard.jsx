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

// affinità: due cerchi che si sovrappongono di più se siete simili
export function Affinity({ score = 0, size = "lg" }) {
  const strong = score >= 40;
  const r = 14;
  const d = 2 * r * (1 - score / 100); // 0 = gusti uguali
  return (
    <div className="flex flex-col items-end">
      <svg
        width={2 * r + 2 * r + 4}
        height={2 * r + 4}
        viewBox={`0 0 ${4 * r + 4} ${2 * r + 4}`}
        aria-hidden="true"
        className="mb-2"
      >
        <circle cx={2 + r + (2 * r - d) / 2} cy={r + 2} r={r} fill="none" stroke="var(--color-fg)" strokeOpacity="0.55" strokeWidth="1.5" />
        <circle cx={2 + r + (2 * r - d) / 2 + d} cy={r + 2} r={r} fill="var(--color-accent)" fillOpacity="0.22" stroke="var(--color-accent)" strokeWidth="1.5" />
      </svg>
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
  compact = false,
}) {
  const { user, compatibility } = match;
  const details = compatibility?.details ?? {};

  return (
    <article className={`surface relative isolate flex h-full flex-col overflow-hidden ${compact ? "p-5" : "p-6"}`}>
      {user?.artisti?.[0]?.img && (
        <div aria-hidden="true" className="ambient pointer-events-none absolute -inset-x-16 -top-32 -z-10 h-96 opacity-60">
          <div className="flex h-full scale-110 blur-[60px] saturate-[1.8]">
            {user.artisti.slice(0, 3).map((a) => (
              <img key={a.id} src={a.img} alt="" className="h-full flex-1 object-cover" />
            ))}
          </div>
        </div>
      )}
      <UserHeader user={user} score={compatibility?.score} size={compact ? "sm" : "lg"} />

      {compact && (
        <div className="mt-5 flex flex-col gap-4 text-sm">
          {user?.artisti?.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex shrink-0 -space-x-2">
                {user.artisti.slice(0, 4).map((a) => (
                  <img
                    key={a.id}
                    src={a.img}
                    alt=""
                    className={`size-9 rounded-full object-cover ring-2 ${isCommon(details.commonArtists, a.nome) ? "ring-accent" : "ring-surface"}`}
                  />
                ))}
              </div>
              <p className="min-w-0 truncate text-muted">
                {user.artisti.map((a, i) => (
                  <span key={a.id} className={isCommon(details.commonArtists, a.nome) ? "font-medium text-accent" : ""}>
                    {i > 0 && ", "}
                    {a.nome}
                  </span>
                ))}
              </p>
            </div>
          )}
          {user?.brani?.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {user.brani.slice(0, 2).map((b) => (
                <li key={b.id} className="flex items-center gap-2.5">
                  <img src={b.img} alt="" className="size-7 rounded-md object-cover" />
                  <span className="min-w-0 truncate">
                    {b.titolo} <span className="text-subtle">· {b.artista}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {user?.generi?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {user.generi.map((g) => (
                <span key={g.id} className={`chip ${isCommon(details.commonGenres, g.nome) ? "border-accent/25 bg-accent-soft text-fg" : ""}`}>
                  {g.nome}
                </span>
              ))}
            </div>
          )}
        </div>
      )}


      {!compact && user?.artisti?.length > 0 && (
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

      {!compact && user?.brani?.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-2 text-xs font-medium text-subtle">Brani</h3>
          <ul className={`-mx-2 ${compact ? "" : "max-h-44 overflow-y-auto"}`}>
            {(compact ? user.brani.slice(0, 3) : user.brani).map((brano) => {
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

      {!compact && user?.generi?.length > 0 && (
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
          <div className={`flex-1 ${compact ? "min-h-4" : "min-h-6"}`} />
          <div className={`flex gap-2 border-t border-line ${compact ? "pt-4" : "pt-5"}`}>{actions}</div>
        </>
      )}
    </article>
  );
}
