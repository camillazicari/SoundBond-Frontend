import { MarqueeDemo } from "./MarqueeDemo";
import { useRef } from "react";
import { Footer } from "./Footer";
import { Rate } from "antd";

const Feedback = () => {
  const scrollRef = useRef(null);

  return (
    <div ref={scrollRef} className="scroll-container fade-in">
      <section className="h-[90vh] flex flex-col justify-center gap-16">
        <h2
          data-scroll
          data-scroll-speed="0.5"
          className="text-8xl font-extrabold text-center"
          style={{ color: "#b849d6" }}
        >
          Dicono di noi
        </h2>{" "}
        <div data-scroll data-scroll-speed="0.5">
          <MarqueeDemo />
        </div>
      </section>
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <Rate
          allowHalf
          defaultValue={2.5}
          style={{
            fontSize: 80,
          }}
        />
      </section>
    </div>
  );
};

export default Feedback;
