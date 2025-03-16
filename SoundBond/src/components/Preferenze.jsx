import React, { useEffect } from "react";
import { motion } from "framer-motion";
import locomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

function Preferenze(props) {
  useEffect(() => {
    const scroll = new locomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
    });

    return () => scroll.destroy();
  }, []);

  return (
    <div data-scroll-container>
      {/* Prima sezione */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{ height: "95dvh" }}
        data-scroll
      >
        {props.component}
      </motion.div>
    </div>
  );
}

export default Preferenze;
