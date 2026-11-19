import { API_URL } from "../config";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBonders } from "../redux/actions/bonders.js";
import BondSpinner from "../components/BondSpinner";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./personalizedComponents/Avatar";
import { useNavigate } from "react-router-dom";

const Bonders = () => {
  const dispatch = useDispatch();
  const bonders = useSelector((state) => state.bonders.bonders);

  useEffect(() => {
    dispatch(getBonders());
  }, [dispatch]);

  if (bonders === undefined) {
    return <BondSpinner />;
  }

  return (
    <div className="container mx-auto fade-in">
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-center mt-2 mb-3"
        style={{
          backgroundImage: "linear-gradient(to right, #d9cfff, #a98bff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        I tuoi bonders
      </h1>

      {bonders && bonders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bonders?.map((bonder) => (
            <BonderCard key={bonder.otherUser.id} bonder={bonder.otherUser} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg font-semibold">
          Non hai ancora nessun bonder
        </p>
      )}
    </div>
  );
};

const BonderCard = ({ bonder }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#14121b] to-[#2c2738] rounded-xl p-6 shadow-lg border border-[#3a3449]/30 hover:border-[#a98bff] transition-all">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={
              bonder?.profilo?.immagine?.startsWith("http")
                ? bonder?.profilo?.immagine
                : `${API_URL}${bonder?.profilo.immagine}`
            }
          />
          <AvatarFallback className="bg-[#a98bff]">
            {bonder.nome?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold ">{bonder?.nome}</h3>
          <p className="text-[#a98bff]">{bonder.profilo?.bio}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          variant="gradient"
          onClick={() => navigate(`/chat/${bonder?.id}`)}
          className="cursor-pointer"
        >
          Messaggio
        </button>
        <button
          variant="outline"
          className="cursor-pointer"
          onClick={() => navigate(`/dettagli/${bonder.id}`)}
        >
          Dettagli
        </button>
      </div>
    </div>
  );
};

export default Bonders;
