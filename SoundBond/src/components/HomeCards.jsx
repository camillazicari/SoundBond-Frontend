import SpotlightCard from "../../animations/SpotlightCard";
import { TextLoopBasic } from "./TextLoopBasic";

const HomeCards = () => {
  return (
    <div className="container mx-auto my-15 text-center">
      <TextLoopBasic />
      <p
        className="mb-12 text-center md:text-xl xl:text-2xl mx-9"
        style={{ color: "rgba(247, 235, 252, 0.4)" }}
      >
        Che tu stia cercando nuovi artisti, playlist personalizzate o
        semplicemente un posto dove condividere la tua passione,
        <span className="text-[#7112b7]"> SoundBond</span> è il tuo spazio
        ideale.
      </p>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4 mb-8">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(173, 66, 255, 0.25)"
          title="ESPLORA LA MUSICA"
          subtitle="Scopri brani e artisti da tutto il mondo."
          svg={
            <div className=" mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="#ead0ff"
                className="bi bi-music-note-beamed"
                viewBox="0 0 16 16"
              >
                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2" />
                <path fillRule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z" />
                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z" />
              </svg>
            </div>
          }
        ></SpotlightCard>
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(173, 66, 255, 0.25)"
          title="SCOPRI LE PLAYLIST DEL GIORNO"
          subtitle="Playlist quotidiane su misura per i tuoi gusti."
          svg={
            <div className=" mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="#ead0ff"
                className="bi bi-music-note-list"
                viewBox="0 0 16 16"
              >
                <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2" />
                <path fillRule="evenodd" d="M12 3v10h-1V3z" />
                <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z" />
                <path
                  fillRule="evenodd"
                  d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"
                />
              </svg>
            </div>
          }
        ></SpotlightCard>
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(173, 66, 255, 0.25)"
          title="CONNETTITI CON ALTRI UTENTI"
          subtitle="Trova nuovi compagni di ascolto."
          svg={
            <div className=" mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="#ead0ff"
                className="bi bi-people-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
              </svg>
            </div>
          }
        ></SpotlightCard>
      </div>
    </div>
  );
};

export default HomeCards;
