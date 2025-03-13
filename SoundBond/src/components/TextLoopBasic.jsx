import { TextLoop } from "../../animations/motion-primitives/text-loop";

export function TextLoopBasic() {
  return (
    <TextLoop className="text-4xl md:text-5xl xl:text-6xl font-bold text-center">
      <span style={{ color: "rgb(138, 46, 157, 1)" }}>ESPLORA.</span>
      <span style={{ color: "rgb(138, 46, 157, 1)" }}>CONDIVIDI.</span>
      <span style={{ color: "rgb(138, 46, 157, 1)" }}>CONNETTI.</span>
    </TextLoop>
  );
}
