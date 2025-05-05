import { MarqueeDemo } from "./MarqueeDemo";
import { useEffect, useRef, useState } from "react";
import { Rate } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRecensione,
  getAllRecensioni,
  getMiaRecensione,
  postRecensione,
  putRecensione,
} from "../redux/actions/recensioni.js";
import { Input } from "@heroui/react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./personalizedComponents/AlertDialog";
import BondSpinner from "./BondSpinner";

const Feedback = () => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const miaRecensione = useSelector((state) => state.recensioni.miaRecensione);
  const recensioni = useSelector((state) => state.recensioni.recensioni);

  const [voto, setVoto] = useState(5);
  const [testo, setTesto] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllRecensioni());
    dispatch(getMiaRecensione());
  }, [dispatch]);

  useEffect(() => {
    if (miaRecensione) {
      setTesto(miaRecensione.testo);
      setVoto(miaRecensione.voto);
    }
  }, [miaRecensione]);

  const handlePost = async () => {
    setIsLoading(true);
    const response = await dispatch(postRecensione(testo, voto));
    if (response?.ok) {
      dispatch(getAllRecensioni());

      toast(
        <p className="flex items-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-check"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>{" "}
          &nbsp; Recensione pubblicata!
        </p>,
        {
          style: {
            background: "rgb(7, 176, 7)",
            border: "none",
          },
        }
      );
    }
    setIsLoading(false);
  };

  const saveRecensione = async () => {
    setIsLoading(true);
    const response = await dispatch(putRecensione(testo, voto));
    if (response?.ok) {
      dispatch(getAllRecensioni());

      toast(
        <p className="flex items-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-check"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>{" "}
          &nbsp; Recensione modificata!
        </p>,
        {
          style: {
            background: "rgb(7, 176, 7)",
            border: "none",
          },
        }
      );
      setIsEdit(false);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await dispatch(deleteRecensione());
    if (response.ok) {
      dispatch(getAllRecensioni());
      setTesto("");
      setVoto(5);
      toast(
        <p className="flex items-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-check"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>{" "}
          &nbsp; Recensione eliminata!
        </p>,
        {
          style: {
            background: "rgb(7, 176, 7)",
            border: "none",
          },
        }
      );
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <BondSpinner />;
  }

  return (
    <div ref={scrollRef} className="scroll-container fade-in">
      {recensioni.length > 0 && (
        <section className="h-[90vh] flex flex-col justify-center gap-16">
          <h2
            data-scroll
            data-scroll-speed="0.5"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold text-center"
            style={{
              backgroundImage: "linear-gradient(to right, #daacff, #9b1fff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dicono di noi
          </h2>{" "}
          <div data-scroll data-scroll-speed="0.5">
            <MarqueeDemo />
          </div>
        </section>
      )}
      <section className="h-[90vh] flex flex-col justify-center items-center">
        {!miaRecensione ? (
          <div className="mx-auto flex flex-col justify-center items-center">
            <h2
              data-scroll
              data-scroll-speed="0.5"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-center mb-7"
              style={{
                backgroundImage: "linear-gradient(to right, #daacff, #9b1fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Lasciaci una recensione!
            </h2>{" "}
            <Rate
              allowHalf
              defaultValue={5}
              value={voto}
              onChange={setVoto}
              className="custom-rate"
            />
            <Input
              value={testo}
              onChange={(e) => setTesto(e.target.value)}
              className="border border-[#3f006f] focus:border-[#ad42ff] rounded-lg mt-7"
              placeholder="Commenta la tua esperienza in SoundBond..."
              maxLength={100}
              minLength={1}
            />
            <div className="w-[100%] mt-2 flex justify-start">
              <span className="text-xs">
                {testo ? testo.length : 0}
                /100 caratteri
              </span>
            </div>
            <div className="flex w-[100%] justify-end gap-2">
              <button
                onClick={handlePost}
                className="bg-[#ad42ff] hover:bg-[#7112b7] py-2 px-3 rounded-md transition-colors"
              >
                Salva
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex flex-col justify-center items-center">
            <h2
              data-scroll
              data-scroll-speed="0.5"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-center"
              style={{
                backgroundImage: "linear-gradient(to right, #daacff, #9b1fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              La tua recensione:
            </h2>{" "}
            {!isEdit ? (
              <div className="flex flex-col justify-center items-center pt-4 mt-4 border-t w-[100%] border-t-[#3f006f]">
                <Rate
                  allowHalf
                  disabled
                  value={miaRecensione.voto}
                  className="custom-rate"
                />
                <p className="text-2xl mt-4 pb-4">"{miaRecensione.testo}"</p>
                <div className="w-[100%] mb-7 flex justify-end items-center py-2 border-t border-t-[#3f006f]">
                  <button
                    className="binButton2"
                    onClick={() => setIsEdit(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-pencil-fill svgIcon bin-bottom"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                    </svg>
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="binButton">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 69 14"
                          className="svgIcon bin-top"
                        >
                          <g clipPath="url(#clip0_35_24)">
                            <path
                              fill="black"
                              d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_35_24">
                              <rect fill="white" height="14" width="69"></rect>
                            </clipPath>
                          </defs>
                        </svg>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 69 57"
                          className="svgIcon bin-bottom"
                        >
                          <g clipPath="url(#clip0_35_22)">
                            <path
                              fill="black"
                              d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_35_22">
                              <rect fill="white" height="57" width="69"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#170228] border border-[#7112b7]/50">
                      <AlertDialogHeader>
                        <AlertDialogTitle></AlertDialogTitle>
                        <AlertDialogDescription className="text-[#efd6f8]">
                          Sei sicur* di voler eliminare la tua recensione?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-[#732880] hover:bg-[#732880]/30 py-2 px-3 rounded-md cursor-pointer">
                          Annulla
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 py-2 px-3 rounded-md cursor-pointer"
                        >
                          Elimina
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <>
                <Rate
                  allowHalf
                  value={voto}
                  onChange={setVoto}
                  className="custom-rate"
                />
                <Input
                  value={testo}
                  onChange={(e) => setTesto(e.target.value)}
                  className="border-b border-b-[#3f006f] focus:border-[#ad42ff] mt-7"
                  placeholder="Commenta la tua esperienza in SoundBond..."
                  maxLength={100}
                  minLength={1}
                />
                <div className="w-[100%] mt-2 flex justify-start">
                  <span className="text-xs">
                    {testo ? testo.length : 0}
                    /100 caratteri
                  </span>
                </div>
                <div className="flex w-[100%] justify-end gap-2">
                  <button
                    onClick={saveRecensione}
                    className="bg-[#ad42ff] hover:bg-[#7112b7] py-2 px-3 rounded-md transition-colors"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="hover:bg-[#7112b7]/30 py-2 px-3 rounded-md"
                  >
                    Annulla
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Feedback;
