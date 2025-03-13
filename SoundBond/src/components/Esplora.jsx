import React, { useEffect } from "react";
import { motion } from "framer-motion";
import locomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { HeroParallaxDemo } from "./HeroParallaxDemo";
import Prova from "./Prova";

function Esplora() {
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
        style={{ height: "100vh" }}
        data-scroll
      >
        <Prova />
      </motion.div>

      {/* Seconda sezione */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{ height: "100vh" }}
        data-scroll
      >
        <Prova />{" "}
      </motion.div>

      {/* Terza sezione */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{ height: "100vh" }}
        data-scroll
      >
        <h2>Section 3</h2>
      </motion.div>
    </div>
  );
}

export default Esplora;
