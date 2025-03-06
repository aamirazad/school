"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Component() {
  const AMOUNT_RAISED = 273;

  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayAmount(AMOUNT_RAISED);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-yellow-50 pl-20">
      <div className="w-full md:w-1/2 h-3/4 md:h-1/2 bg-white rounded-lg shadow-md md:p-3 relative overflow-hidden flex flex-col justify-between">
        <h1 className="text-md sm:text-lg font-bold text-yellow-600 text-center lg:text-4xl md:text-2xl">
          YMCA Yellow Shoelace Fundraiser
        </h1>

        <div className="flex items-center justify-center grow text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-yellow-500 mr-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ${displayAmount.toLocaleString()}
          </motion.div>
          <p className="text-sm text-yellow-600 sm:text-lg md:text-2xl lg:text-4xl ">
            raised!
          </p>
        </div>
        <p className="text-yellow-800 text-xm text-center relative z-10">
          Get your yellow shoelaces!
        </p>
      </div>
    </div>
  );
}
