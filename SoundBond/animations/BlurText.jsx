import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const BlurText = ({
  text = "",
  delay = 0.2,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultVariants = {
    hidden: {
      opacity: 0,
      y: direction === "top" ? -50 : 50,
      filter: "blur(10px)",
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * delay,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="container mx-auto my-20 flex">
      <p ref={ref} className={`blur-text ${className} flex flex-wrap mb-0`}>
        {elements.map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={defaultVariants}
            className="block text-6xl font-extrabold will-change-[transform,filter,opacity]"
          >
            {char === " " ? "\u00A0" : char}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        ))}
      </p>
    </div>
  );
};

export default BlurText;
