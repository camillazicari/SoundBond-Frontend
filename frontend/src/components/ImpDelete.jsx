import { Trash2 } from "lucide-react";
import { Card } from "./personalizedComponents/Card";
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
import { useDispatch } from "react-redux";
import { deleteUtente } from "../redux/actions/account.js";
import { useNavigate } from "react-router-dom";

const ImpDelete = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deleteProfile = () => {
    dispatch(deleteUtente(navigate));
    dispatch({ type: "LOGOUT", payload: true });
  };

  return (
    <Card className="p-6 backdrop-blur-lg bg-[#3f006f]/30 border border-[#7112b7]/50 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#c476ff] mb-1">
            Eliminazione profilo
          </h3>
          <p className="text-sm text-[#efd6f8]">
            Questa azione è irreversibile.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              variant="destructive"
              className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md flex items-center transition-colors"
            >
              <Trash2 size={18} className="mr-2" /> Elimina profilo
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#3f006f]/30 border border-[#7112b7]/50">
            <AlertDialogHeader>
              <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#efd6f8]">
                Questa azione non può essere annullata. <br />
                Eliminerà definitivamente il tuo profilo e tutti i dati
                associati.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[#732880] hover:bg-[#732880]/30 py-2 px-3 rounded-md">
                Annulla
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteProfile}
                className="bg-red-600 hover:bg-red-700 py-2 px-3 rounded-md "
              >
                Elimina
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default ImpDelete;
