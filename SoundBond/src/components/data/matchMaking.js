import { useSelector } from "react-redux";

export const calculateCompatibility = (user1, user2) => {
  let score = 0;
  const maxScore = 100;

  // Compatibilità generi (60% del totale)
  const genreWeight = 0.6;
  // Estrai il nome per ogni genere, invece che l'oggetto intero
  const user1Generi = user1.generi?.map((genre) => genre.nome.trim().toLowerCase());
  const user2Generi = user2.generi?.map((genre) => genre.nome.trim().toLowerCase());
  const commonGenres = user1Generi?.filter((genre) =>
    user2Generi.includes(genre)
  );
  const genreScore =
    (commonGenres?.length / Math.max(user1Generi?.length, user2Generi?.length)) *
    maxScore *
    genreWeight;

  // Compatibilità artisti (40% del totale)
  const artistWeight = 0.4;
  const user1ArtistNames = user1.artisti?.map((artist) =>
    artist.nome.trim().toLowerCase()
  );
  const user2ArtistNames = user2.artisti?.map((artist) =>
    artist.nome.trim().toLowerCase()
  );
  const commonArtists = user1ArtistNames?.filter((nome) =>
    user2ArtistNames.includes(nome)
  );
  const artistScore =
    (commonArtists?.length /
      Math.max(user1ArtistNames?.length, user2ArtistNames?.length)) *
    maxScore *
    artistWeight;

  // Compatibilità brani (10% del totale)
  // const trackWeight = 0.1;
  // const user1TrackNames = user1.brani.map(
  //   (track) =>
  //     `${track.titolo.trim().toLowerCase()} - ${track.artista.trim().toLowerCase()}`
  // );
  // const user2TrackNames = user2.brani.map(
  //   (track) =>
  //     `${track.titolo.trim().toLowerCase()} - ${track.artista.trim().toLowerCase()}`
  // );
  // const commonTracks = user1TrackNames.filter((track) =>
  //   user2TrackNames.includes(track)
  // );
  // const trackScore =
  //   (commonTracks.length /
  //     Math.max(user1TrackNames.length, user2TrackNames.length)) *
  //   maxScore *
  //   trackWeight;

  // Calcola score finale
  score = genreScore + artistScore;

  return {
    score: Math.round(score),
    details: {
      commonGenres,
      commonArtistCount: commonArtists?.length,
      commonArtists: commonArtists,
      //commonTrackCount: commonTracks.length,
    },
  };
};

// Genera % compatibilità per tutti gli utenti
export const useGetUserMatches = () => {
  const currentUser = useSelector((state) => state.account.userLogged) || {};
  const utenti = useSelector((state) => state.account.users) || [];

  if (!currentUser) return [];

  const matches = utenti?.map((user) => {
    const compatibility = calculateCompatibility(currentUser, user);
    return {
      user,
      compatibility,
    };
  })
    .sort((a, b) => b.compatibility.score - a.compatibility.score);

  return matches;
};
