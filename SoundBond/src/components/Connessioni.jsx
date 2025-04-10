/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGetUserMatches } from "./data/matchMaking.js";
import { useDispatch } from "react-redux";
import { getUtenteLoggato, getUtenti } from "@/redux/actions/account.js";

const Connessioni = () => {
  const matches = useGetUserMatches();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUtenteLoggato());
    dispatch(getUtenti());
  }, []);
  console.log("MATCH:", matches);

  if (!matches || matches.length === 0) {
    return <div>Nessun match disponibile.</div>;
  }

  return (
    <div>
      <h2>Match degli utenti</h2>
      <ul>
        {matches &&
          matches?.map((match) => (
            <li key={match.user.id}>
              <strong>{match.user.nome}</strong> - Compatibilità:{" "}
              {match.compatibility.score}%
              <br />
              <p>
                Generi in comune:{" "}
                {match.compatibility.details.commonGenres
                  .map((g) => g.charAt(0).toUpperCase() + g.slice(1))
                  .join(", ")}
              </p>
              <p>
                Artisti in comune:{" "}
                {match.compatibility.details.commonArtistCount}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
};
export default Connessioni;
