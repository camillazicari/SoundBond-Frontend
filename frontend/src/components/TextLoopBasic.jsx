import { TextLoop } from "./personalizedComponents/text-loop";

export function TextLoopBasic() {
  return (
    <TextLoop className="text-4xl md:text-5xl xl:text-6xl font-bold text-center">
      <span className="text-[#9b1fff]">ESPLORA.</span>
      <span className="text-[#9b1fff]">CONDIVIDI.</span>
      <span className="text-[#9b1fff]">CONNETTI.</span>
    </TextLoop>
  );
}
