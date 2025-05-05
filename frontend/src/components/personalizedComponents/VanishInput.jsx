"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export function VanishInput({ placeholders, onChange, onSubmit, value }) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [animating, setAnimating] = useState(false);

  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  const startAnimation = useCallback(() => {
    if (placeholders.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    }
  }, [placeholders]);

  useEffect(() => {
    startAnimation();
    return () => clearInterval(intervalRef.current);
  }, [startAnimation]);

  const handleInputChange = (e) => {
    if (!animating) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  const vanishAndSubmit = () => {
    if (!value) return;
    setAnimating(true);
    onSubmit(value);
    onChange("");
    setTimeout(() => {
      setAnimating(false);
    }, 1000);
  };

  return (
    <form
      className="relative w-full max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-md"
      onSubmit={(e) => {
        e.preventDefault();
        vanishAndSubmit();
      }}
    >
      <input
        type="text"
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full h-full pl-4 pr-12 text-sm sm:text-base bg-transparent border-none focus:outline-none"
      />
      <button
        type="submit"
        disabled={!value || animating}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black dark:bg-zinc-900 flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white h-4 w-4"
        >
          <path d="M5 12l14 0" />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>
      {!value && (
        <div className="absolute inset-0 flex items-center pl-4 sm:pl-12 text-sm text-gray-400 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPlaceholder}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="truncate w-full"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </form>
  );
}
