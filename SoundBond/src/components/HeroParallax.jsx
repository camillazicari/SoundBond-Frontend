"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Link } from "react-router-dom";

export const HeroParallax = ({ products = [] }) => {
  function useIsLargeScreen() {
    const [isLarge, setIsLarge] = useState(false);

    useEffect(() => {
      const checkScreen = () => setIsLarge(window.innerWidth >= 1024);
      checkScreen();
      window.addEventListener("resize", checkScreen);
      return () => window.removeEventListener("resize", checkScreen);
    }, []);

    return isLarge;
  }

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  const isLargeScreen = useIsLargeScreen();

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.2],
      isLargeScreen ? [-700, 500] : [-700, 200]
    ),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[225vh] lg:h-[277vh] pt-110 md:pt-40 lg:pt-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="relative"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 mb-10 relative">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-10 space-x-10 relative">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 relative">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="relative mx-auto pt-20 md:py-40 px-4 w-full left-0 bottom-65 md:bottom-10 lg:top-8">
      <h1 className="ms-5 shiny-text font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-10 md:leading-12 lg:leading-[5rem]">
        LA TUA MUSICA, <br />
        LE TUE CONNESSIONI
      </h1>
    </div>
  );
};

export const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-70 w-85 md:w-95 lg:h-86 lg:w-[30rem] relative shrink-0"
    >
      <Link to={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
