import { cn } from "../lib/utils";
import { Marquee } from "./personalizedComponents/marquee";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllRecensioni } from "../redux/actions/recensioni.js";

const ReviewCard = ({ recensione }) => (
  <figure
    className={cn(
      "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
    )}
  >
    <div className="flex flex-row items-center gap-2">
      <img
        className="rounded-full object-cover w-10 h-10"
        alt=""
        src={
          recensione.imgUser.startsWith("http")
            ? recensione.imgUser
            : `http://192.168.1.63:5220${recensione.imgUser}`
        }
      />
      <div className="flex flex-col">
        <figcaption className="text-sm font-medium dark:text-white">
          {recensione.nomeUser}
        </figcaption>
        <p className="text-xs font-medium dark:text-white/40">
          {recensione.nomeUtenteUser}
        </p>
      </div>
    </div>
    <blockquote className="mt-2 text-sm">{recensione.testo}</blockquote>
  </figure>
);

export function MarqueeDemo() {
  const dispatch = useDispatch();
  const recensioni = useSelector((state) => state.recensioni.recensioni);
  const metà = Math.ceil(recensioni.length / 2);
  const firstRow = recensioni.slice(0, metà);
  const secondRow = recensioni.slice(metà);

  useEffect(() => {
    dispatch(getAllRecensioni());
  }, [dispatch]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((r, i) => (
          <ReviewCard key={i} recensione={r} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((r, i) => (
          <ReviewCard key={i} recensione={r} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
