/* eslint-disable react-hooks/exhaustive-deps */
import { getProfilo } from "@/redux/actions/profilo.js";
import { getUtenteLoggato } from "../redux/actions/account.js";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function NavAvatar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.userLogged);
  const profilo = useSelector((state) => state.profilo.profilo);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      dispatch(getUtenteLoggato());
      dispatch(getProfilo());
    }
  }, []);

  useEffect(() => {}, [profilo]);

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT", payload: true });
  };

  return (
    <div className="flex items-center">
      <Dropdown placement="bottom-center">
        <DropdownTrigger>
          <div className="border-2 border-[#ad42ff] rounded-full">
            {profilo && profilo.immagine ? (
              <img
                src={profilo.immagine}
                className="rounded-full w-[50px] h-[50px] object-cover border-2 border-transparent"
                alt="user"
              />
            ) : (
              <img
                src="https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png"
                className="rounded-full w-[50px] h-[50px] object-cover border-2 border-transparent"
                alt="user"
              />
            )}
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User Actions"
          className="flex justify-center p-2 border-[#ad42ff] border-[0.5px] rounded-lg"
          style={{
            backgroundColor: "rgba(12, 5, 18, 0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <DropdownItem
            key="profile"
            textValue={user ? `@${user.nomeUtente}` : "@Guest"}
            className="gap-2 border-b-[0.5px] border-[#ad42ff] flex justify-center text-center"
          >
            {user ? (
              <p className="font-bold text-sm">@{user.nomeUtente}</p>
            ) : (
              <p className="font-bold text-sm">@Guest</p>
            )}
          </DropdownItem>
          <DropdownItem
            className="text-sm text-start py-2 px-12 rounded-sm hover:bg-[#ad42ff] mt-1 flex items-center gap-2"
            key="settings"
            textValue="Settings"
          >
            <Link to={"/impostazioni"} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-gear"
                viewBox="0 0 16 16"
              >
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
              </svg>
              <p>Impostazioni</p>
            </Link>
          </DropdownItem>
          <DropdownItem
            className="text-sm text-start py-2 px-12 rounded-sm hover:bg-[#ad42ff]"
            key="bonders"
            textValue="bonders"
          >
            <Link to={"/bonders"} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-heart"
                viewBox="0 0 16 16"
              >
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
              <p>Bonders</p>
            </Link>
          </DropdownItem>
          <DropdownItem
            className="text-sm text-start py-2 px-12 rounded-sm hover:bg-[#ad42ff]"
            key="feedback"
            textValue="Feedback"
          >
            <Link to={"/feedback"} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-star-half"
                viewBox="0 0 16 16"
              >
                <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z" />
              </svg>
              <p>Feedback</p>
            </Link>
          </DropdownItem>

          <DropdownItem
            className="text-sm text-start py-2 px-12 rounded-sm hover:bg-red-500"
            key="logout"
            color="danger"
            textValue="Logout"
          >
            <button
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleLogOut}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-box-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                />
              </svg>
              <p>Log Out</p>
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
