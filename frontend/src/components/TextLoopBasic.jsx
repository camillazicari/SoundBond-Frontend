import { TextLoop } from "./personalizedComponents/text-loop";

export function TextLoopBasic() {
  return (
    <TextLoop className="text-4xl md:text-5xl xl:text-6xl font-bold text-center">
      <span className="text-[#a98bff]">ESPLORA.</span>
      <span className="text-[#a98bff]">CONDIVIDI.</span>
      <span className="text-[#a98bff]">CONNETTI.</span>
    </TextLoop>
  );
}
