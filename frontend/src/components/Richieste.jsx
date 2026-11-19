/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  deleteRichiesta,
  getRichiesteInviate,
  getRichiesteRicevute,
} from "../redux/actions/richieste.js";
import { postBonder } from "../redux/actions/bonders.js";
import BondSpinner from "./BondSpinner";
import MatchCard from "./MatchCard.jsx";
import PageHeader from "./ui/PageHeader.jsx";
import { motion } from "motion/react";
import { Check, Clock, Loader2, X } from "lucide-react";
import { useGetUserMatches } from "./data/matchMaking";

const asMatch = (user, match) => match ?? { user, compatibility: { score: undefined, details: {} } };

const Spinner = () => <Loader2 size={17} className="animate-spin" aria-hidden="true" />;

const RequestCard = React.memo(
  ({ richiesta, match, onAccept, onReject, isAcceptLoading, isRejectLoading }) => {
    const busy = isAcceptLoading || isRejectLoading;
    const name = richiesta.sender?.nome;
    return (
      <MatchCard
        match={asMatch(richiesta.sender, match)}
        actions={
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => onAccept(richiesta.sender?.id)}
              className="btn btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Accetta la richiesta di ${name}`}
            >
              {isAcceptLoading ? <Spinner /> : <Check size={17} strokeWidth={2.5} />} Accetta
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onReject(richiesta.sender?.id)}
              className="btn btn-ghost flex-1 hover:border-rose-400/40 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Rifiuta la richiesta di ${name}`}
            >
              {isRejectLoading ? <Spinner /> : <X size={17} />} Rifiuta
            </button>
          </>
        }
      />
    );
  }
);

const RequestSentCard = React.memo(({ richiesta, match }) => (
  <MatchCard
    match={asMatch(richiesta.receiver, match)}
    actions={
      <p className="flex flex-1 items-center gap-2 py-2 text-sm text-muted">
        <Clock size={16} /> In attesa di risposta
      </p>
    }
  />
));

const Richieste = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState({});
  const [localRequests, setLocalRequests] = useState({
    inviate: [],
    ricevute: [],
  });

  const dispatch = useDispatch();
  const matches = useGetUserMatches();

  const richiesteInviate = useSelector(
    (state) => state.richieste.richiesteInviate,
    shallowEqual
  );
  const richiesteRicevute = useSelector(
    (state) => state.richieste.richiesteRicevute,
    shallowEqual
  );

  const fetchRequests = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(getRichiesteInviate()),
        dispatch(getRichiesteRicevute()),
      ]);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = useCallback(
    async (senderId) => {
      let startTime;
      try {
        setLoadingStates((prev) => ({
          ...prev,
          [senderId]: { ...prev[senderId], accept: true },
        }));

        startTime = Date.now();

        await dispatch(postBonder(senderId));
        await dispatch(getRichiesteRicevute());

        setLocalRequests((prev) => ({
          ...prev,
          ricevute: prev.ricevute?.filter((req) => req.sender.id !== senderId),
        }));
      } catch (error) {
        console.error("Error accepting request:", error);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 800;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
          setLoadingStates((prev) => ({
            ...prev,
            [senderId]: { ...prev[senderId], accept: false },
          }));
        }, remainingTime);
      }
    },
    [dispatch, richiesteRicevute]
  );

  const handleReject = useCallback(
    async (senderId) => {
      let startTime;
      try {
        setLoadingStates((prev) => ({
          ...prev,
          [senderId]: { ...prev[senderId], reject: true },
        }));

        startTime = Date.now();

        await dispatch(deleteRichiesta(senderId));
        await dispatch(getRichiesteRicevute());

        setLocalRequests((prev) => ({
          ...prev,
          ricevute: prev.ricevute?.filter((req) => req.sender.id !== senderId),
        }));
      } catch (error) {
        console.error("Error rejecting request:", error);
        setLocalRequests((prev) => ({
          ...prev,
          ricevute: richiesteRicevute,
        }));
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 800;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
          setLoadingStates((prev) => ({
            ...prev,
            [senderId]: { ...prev[senderId], reject: false },
          }));
        }, remainingTime);
      }
    },
    [dispatch, richiesteRicevute]
  );

  const requestsToShow = useMemo(
    () => ({
      inviate:
        localRequests.inviate.length > 0
          ? localRequests.inviate
          : richiesteInviate,
      ricevute:
        localRequests.ricevute.length > 0
          ? localRequests.ricevute
          : richiesteRicevute,
    }),
    [localRequests, richiesteInviate, richiesteRicevute]
  );

  const renderRequestItem = useCallback(
    (richiesta) => {
      const match = matches.find((m) => m.user?.id === richiesta.sender?.id);
      const senderId = richiesta.sender?.id;
      const isAcceptLoading = loadingStates[senderId]?.accept || false;
      const isRejectLoading = loadingStates[senderId]?.reject || false;

      return (
        <RequestCard
          key={richiesta.id}
          richiesta={richiesta}
          match={match}
          onAccept={handleAccept}
          onReject={handleReject}
          isAcceptLoading={isAcceptLoading}
          isRejectLoading={isRejectLoading}
        />
      );
    },
    [matches, loadingStates, handleAccept, handleReject]
  );

  const renderRequestSentItem = useCallback(
    (richiesta) => {
      const match = matches.find((m) => m.user?.id === richiesta.receiver?.id);

      return (
        <RequestSentCard
          key={richiesta.id}
          richiesta={richiesta}
          match={match}
        />
      );
    },
    [matches]
  );

  const ITEMS = useMemo(
    () => [
      {
        title: "Ricevute",
        count: requestsToShow.ricevute?.length ?? 0,
        content: (
          requestsToShow.ricevute?.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requestsToShow.ricevute.map((r) => <li key={r.id}>{renderRequestItem(r)}</li>)}
            </ul>
          ) : (
            <Empty title="Nessuna richiesta ricevuta." text="Quando qualcuno vorrà fare bond con te, lo vedrai qui." />
          )
        ),
      },
      {
        title: "Inviate",
        count: requestsToShow.inviate?.length ?? 0,
        content: (
          requestsToShow.inviate?.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {requestsToShow.inviate.map((r) => <li key={r.id}>{renderRequestSentItem(r)}</li>)}
            </ul>
          ) : (
            <Empty title="Nessuna richiesta inviata." text="Trova qualcuno in sintonia con te nelle connessioni." />
          )
        ),
      },
    ],
    [requestsToShow, renderRequestItem, renderRequestSentItem]
  );

  if (richiesteInviate === undefined || richiesteRicevute === undefined) {
    return <BondSpinner />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-16 md:pt-15">
      <PageHeader eyebrow="Richieste" title="Chi vuole" accent="fare bond.">
        Accetta una richiesta e la persona diventa un tuo bonder: potrete scrivervi in chat.
      </PageHeader>

      <div role="tablist" aria-label="Tipo di richieste" className="mt-10 inline-flex rounded-full border border-line bg-white/[0.03] p-1">
        {ITEMS.map((item, index) => {
          const active = activeIndex === index;
          return (
            <button
              key={item.title}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveIndex(index)}
              className={`relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors ${active ? "text-accent-ink" : "text-muted hover:text-fg"}`}
            >
              {active && (
                <motion.span layoutId="req-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", bounce: 0, duration: 0.35 }} />
              )}
              <span className="relative">
                {item.title} <span className="font-mono opacity-70">{item.count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8" role="tabpanel">
        {ITEMS[activeIndex].content}
      </div>
    </div>
  );
};

const Empty = ({ title, text }) => (
  <div className="surface px-6 py-16 text-center">
    <p className="display text-3xl font-bold">{title}</p>
    <p className="mt-2 text-muted">{text}</p>
  </div>
);

export default React.memo(Richieste);
