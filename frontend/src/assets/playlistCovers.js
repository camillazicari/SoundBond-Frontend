// copertine delle playlist
const modules = import.meta.glob("./PLAYLISTS/P*.jpeg", { eager: true, import: "default" });

export const playlistCovers = Array.from(
  { length: 10 },
  (_, i) => modules[`./PLAYLISTS/P${i + 1}.jpeg`]
);
