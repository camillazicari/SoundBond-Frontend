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
    <Card className="surface border-rose-400/25 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="display text-3xl font-bold mb-2">
            Eliminazione profilo
          </h3>
          <p className="text-sm text-muted">
            Questa azione è irreversibile.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              variant="destructive"
              className="btn mt-4 border border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 md:mt-0"
            >
              <Trash2 size={18} /> Elimina profilo
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass rounded-[var(--radius-card)] border-line">
            <AlertDialogHeader>
              <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
              <AlertDialogDescription className="text-fg">
                Questa azione non può essere annullata. <br />
                Eliminerà definitivamente il tuo profilo e tutti i dati
                associati.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn btn-ghost">
                Annulla
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteProfile}
                className="btn bg-rose-500 text-white hover:bg-rose-600"
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
