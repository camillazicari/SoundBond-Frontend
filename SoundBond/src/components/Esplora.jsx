const Esplora = () => {
  //fare get generi da https://api.deezer.com/genre
  //fare get generi utente
  //trovare id dei generi di deezer dove data.name = genere.nome e pusharli in un array
  //ciclare l'array e per ogni genere fare get artisti corrispondenti da https://api.deezer.com/genre/{genre_id}/artists
  //trovare id artisti e fare get top brani di quegli artisti da GET https://api.deezer.com/artist/{artist_id}/top?limit=5
  //   TODO ESEMPIO:
  //       const trackIds = [];
  //   for (const genreId of selectedGenreIds) {
  //       const artistsRes = await fetch(`https://api.deezer.com/genre/${genreId}/artists`);
  //       const artists = await artistsRes.json();
  //       for (const artist of artists.data.slice(0, 3)) { // prendi i primi 3 artisti (per esempio)
  //         const topRes = await fetch(`https://api.deezer.com/artist/${artist.id}/top?limit=5`);
  //         const topTracks = await topRes.json();
  //         topTracks.data.forEach(track => {
  //           trackIds.push(track.id);
  //         });
  //       }
  //     }
  //   TRACKIDS CONTIENE TUTTI I BRANI DI ARTISTI DIVERSI
};

export default Esplora;
