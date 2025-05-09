import ImpArtisti from "./ImpArtisti";
import ImpBrani from "./ImpBrani";
import ImpDelete from "./ImpDelete";
import ImpGeneri from "./ImpGeneri";
import ImpUser from "./ImpUser";

const Impostazioni = () => {
  return (
    <div className="py-4 px-4 md:px-8 lg:px-12 fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter "
            style={{
              backgroundImage: "linear-gradient(to right, #daacff, #9b1fff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Impostazioni Profilo
          </h1>
          <p className="text-base md:text-lg lg:text-xl">
            Personalizza la tua esperienza musicale
          </p>
        </div>
        <div className="grid gap-6">
          {/* Sezione Immagine, Username e Bio */}
          <ImpUser />

          {/* Sezione Generi Preferiti */}
          <ImpGeneri />

          {/* Sezione Brani Preferiti */}
          <ImpBrani />

          {/* Sezione Artisti Preferiti */}
          <ImpArtisti />

          {/* Sezione Eliminazione Profilo */}
          <ImpDelete />
        </div>
      </div>
    </div>
  );
};

export default Impostazioni;
