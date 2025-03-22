import { Card } from "../../animations/Card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../../animations/Avatar";
import { Input } from "../../animations/Input";
import { Edit2, Save, X, Camera } from "lucide-react";
import { useState, useRef } from "react";

const ImpUser = () => {
  // TODO: PROFILO ESEMPIO!!!!!!!!!
  const [profile, setProfile] = useState({
    username: "MusicLover",
    bio: "Appassionato di musica di tutti i generi, ma con una predilezione per il rock alternativo e la musica elettronica.",
    avatar: "",
  });
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
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
            &nbsp; Immagine di profilo aggiornata!
          </p>,
          {
            style: {
              background: "rgb(7, 176, 7)",
              border: "none",
            },
          }
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUsername = () => {
    if (newUsername.trim()) {
      setProfile({ ...profile, username: newUsername });
      setEditUsername(false);
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
          &nbsp; Username aggiornato!
        </p>,
        {
          style: {
            background: "rgb(7, 176, 7)",
            border: "none",
          },
        }
      );
    } else {
      toast(
        <p className="flex items-center">
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
            class="lucide lucide-circle-alert"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>{" "}
          &nbsp; L'username non può essere vuoto!
        </p>,
        {
          style: {
            background: "rgb(202, 8, 8)",
            border: "none",
          },
        }
      );
    }
  };

  return (
    <>
      <Card className="p-6 backdrop-blur-lg bg-[#3d0d45]/30 border border-[#732880]/30 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-[#b849d6] transition-all duration-300 group-hover:border-[#d489e9]">
              <AvatarImage src={profile.avatar} alt={profile.username} />
              <AvatarFallback className="bg-[#732880] text-white text-2xl">
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 bg-[#b849d6] p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              <Camera size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="flex-1">
            <div>
              <label
                className="text-md font-semibold block text-center md:text-start"
                style={{ color: "#e4b5f2" }}
              >
                Username
              </label>
              {editUsername ? (
                <div className="flex">
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-[#3d0d45]/50 border-[#732880] focus:border-[#b849d6]"
                  />
                  <button
                    onClick={saveUsername}
                    className="hover:bg-[#732880]/30 p-2.5 rounded-4xl ml-2 md:ml-4"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setEditUsername(false);
                      setNewUsername(profile.username);
                    }}
                    className="hover:bg-[#732880]/30 p-2.5 rounded-4xl"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white mb-0">
                    {profile.username} &nbsp;
                  </h3>
                  <button
                    onClick={() => setEditUsername(true)}
                    className="hover:bg-[#732880]/30 p-2 rounded-2xl"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ImpUser;
