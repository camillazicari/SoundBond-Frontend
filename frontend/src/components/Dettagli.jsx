import { DEEZER_PROXY_URL } from "../config";
/* eslint-disable react-hooks/exhaustive-deps */
import { getUtenti } from "../redux/actions/account.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { MessageCircle, Pause, Play, UserMinus } from "lucide-react";
import { Affinity, profileImage } from "./MatchCard.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./personalizedComponents/Avatar.jsx";
import { calculateCompatibility } from "./data/matchMaking.js";
import BondSpinner from "./BondSpinner";
import { usePlayer } from "../context/PlayerContext";
import { deleteBonder, getBonders } from "../redux/actions/bonders";

const Dettagli = () => {
  const { id } = useParams();
  const users = useSelector((state) => state.account.users);
  const bonders = useSelector((state) => state.bonders.bonders);
  const isBonder = bonders.find((u) => u.otherUser.id === id);
  const me = useSelector((state) => state.account.userLogged);
  const user = users.find((u) => u.id === id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUtenti());
    dispatch(getBonders());
  }, []);

  const {
    nowPlaying,
    setNowPlaying,
    setAudio,
    audio,
    setIsPlaying,
    isPlaying,
  } = usePlayer();

  const getSongs = async (titolo, artista) => {
    const url = `${DEEZER_PROXY_URL}/api/search?q=${titolo}%20${artista}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const firstSong = data.data[0];
          console.log(firstSong);
          setNowPlaying(firstSong);
          setIsPlaying(true);

          const newAudio = new Audio(firstSong.preview);

          setAudio(newAudio);

          newAudio.addEventListener("ended", () => {
            setIsPlaying(false);
            setNowPlaying(null);
            console.log("fine brano!");
          });
          newAudio.play().catch((err) => {
            console.error("Errore nella riproduzione:", err);
          });
        }
      } else {
        throw new Error("Errore nel recupero dei dati");
      }
    } catch (error) {
      console.log("errore", error);
    }
  };

  const handleSongClick = (songTitle, artist) => {
    if (nowPlaying?.title === songTitle) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      getSongs(songTitle, artist);
    }
  };

  if (!user?.nome) return <BondSpinner />;

  const compatibility = me?.id ? calculateCompatibility(me, user) : null;
  const common = new Set([
    ...(compatibility?.details?.commonArtists ?? []),
    ...(compatibility?.details?.commonGenres ?? []),
  ]);
  const isCommon = (n) => common.has(n?.trim().toLowerCase());

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-16 md:pt-15">
      <section className="surface relative isolate overflow-hidden p-6 md:p-10">
        {user.artisti?.[0]?.img && (
          <div aria-hidden="true" className="ambient pointer-events-none absolute -inset-x-20 -top-40 -z-10 h-[30rem] opacity-55">
            <div className="flex h-full scale-110 blur-[70px] saturate-[1.8]">
              {user.artisti.slice(0, 3).map((a) => (
                <img key={a.id} src={a.img} alt="" className="h-full flex-1 object-cover" />
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <Avatar className="size-28 ring-1 ring-line-strong md:size-36">
              <AvatarImage src={profileImage(user?.profilo?.immagine)} alt="" className="object-cover" />
              <AvatarFallback className="bg-accent-soft text-3xl font-semibold text-accent">{user.nome.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">{isBonder ? "Bonder" : "Profilo"}</p>
              <h1 className="display mt-2 text-[clamp(2.75rem,7vw,5rem)] font-bold">{user.nome} {user.cognome}</h1>
              <p className="mt-2 text-muted">@{user.nomeUtente}</p>
            </div>
          </div>
          {typeof compatibility?.score === "number" && <Affinity score={compatibility.score} />}
        </div>
        {user.profilo?.bio && <p className="mt-8 max-w-2xl text-lg text-muted">{user.profilo.bio}</p>}
        {isBonder && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link to={`/chat/${user.id}`} className="btn btn-primary">
              <MessageCircle size={17} /> Scrivi
            </Link>
            <button
              type="button"
              onClick={() => dispatch(deleteBonder(user?.id))}
              className="btn btn-ghost hover:border-rose-400/40 hover:text-rose-200"
            >
              <UserMinus size={17} /> Rimuovi bond
            </button>
          </div>
        )}
      </section>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-12">
          {user.artisti?.length > 0 && (
            <section>
              <h2 className="display mb-6 text-3xl font-bold">Artisti</h2>
              <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5">
                {user.artisti.map((a) => (
                  <li key={a.id} className="text-center">
                    <img
                      src={a.img}
                      alt=""
                      className={`aspect-square w-full rounded-full object-cover ${isCommon(a.nome) ? "ring-2 ring-accent ring-offset-4 ring-offset-ink" : "ring-1 ring-line"}`}
                    />
                    <p className="mt-3 line-clamp-2 text-sm">{a.nome}</p>
                    {isCommon(a.nome) && <p className="text-xs text-accent">In comune</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {user.generi?.length > 0 && (
            <section>
              <h2 className="display mb-6 text-3xl font-bold">Generi</h2>
              <div className="flex flex-wrap gap-2">
                {user.generi.map((g) => (
                  <span key={g.id} className={`chip px-4 py-1.5 text-sm ${isCommon(g.nome) ? "border-accent/25 bg-accent-soft text-fg" : ""}`}>{g.nome}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        {user.brani?.length > 0 && (
          <section>
            <h2 className="display mb-6 text-3xl font-bold">Brani</h2>
            <ol className="surface p-2">
              {user.brani.map((brano, i) => {
                const playing = nowPlaying?.title === brano.titolo && isPlaying;
                return (
                  <li key={brano.id}>
                    <button
                      type="button"
                      onClick={() => handleSongClick(brano.titolo, brano.artista)}
                      aria-label={playing ? `Metti in pausa ${brano.titolo}` : `Ascolta ${brano.titolo}`}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <span className="w-5 shrink-0 text-right font-mono text-sm text-subtle">{i + 1}</span>
                      <img src={brano.img} alt="" className="size-11 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate font-medium ${playing ? "text-accent" : ""}`}>{brano.titolo}</span>
                        <span className="block truncate text-sm text-muted">{brano.artista}</span>
                      </span>
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full ${playing ? "bg-accent text-accent-ink" : "bg-white/[0.06]"}`}>
                        {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dettagli;
