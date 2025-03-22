import { useState } from "react";
import { toast } from "sonner";
import { Card } from "../../animations/Card";
import { Edit2 } from "lucide-react";
import { Textarea } from "../../animations/TextArea";

const ImpBio = () => {
  const [profile, setProfile] = useState({
    username: "MusicLover",
    bio: "Appassionato di musica di tutti i generi, ma con una predilezione per il rock alternativo e la musica elettronica.",
    avatar: "",
  });
  const [editBio, setEditBio] = useState(false);
  const [newBio, setNewBio] = useState(profile.bio);

  const saveBio = () => {
    setProfile({ ...profile, bio: newBio });
    setEditBio(false);
    toast(
      <p className=" flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-circle-check"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>{" "}
        &nbsp; Biografia aggiornata!
      </p>,
      {
        style: {
          background: "rgb(7, 176, 7)",
          border: "none",
        },
      }
    );
  };

  return (
    <Card className="p-6 backdrop-blur-lg bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold" style={{ color: "#e4b5f2" }}>
          La tua biografia
        </h3>
        {!editBio && (
          <button
            onClick={() => setEditBio(true)}
            className="hover:bg-[#732880]/30 p-2 rounded-2xl"
          >
            <Edit2 size={18} />
          </button>
        )}
      </div>
      {editBio ? (
        <div>
          <Textarea
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            className="min-h-[120px] bg-[#3d0d45]/50 border-[#732880] focus:border-[#b849d6]"
            placeholder="Racconta qualcosa su di te..."
            maxLength={500}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs">{newBio.length}/500 caratteri</span>
            <div className="flex gap-2">
              <button
                onClick={saveBio}
                className="bg-[#b849d6] hover:bg-[#a43bbe] py-1 px-2 rounded-lg"
              >
                Salva
              </button>
              <button
                onClick={() => {
                  setEditBio(false);
                  setNewBio(profile.bio);
                }}
                variant="outline"
                className="border-[#732880] hover:bg-[#732880]/30 py-1 px-2 rounded-lg"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[#fbf5fe] leading-relaxed">
          {profile.bio || "Nessuna biografia. Aggiungi qualcosa su di te!"}
        </p>
      )}
    </Card>
  );
};

export default ImpBio;
