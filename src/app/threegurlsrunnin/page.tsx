"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Component() {
  const AMOUNT_RAISED = 173;

  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayAmount(AMOUNT_RAISED);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-yellow-50 pl-20">
      <div className="w-full md:w-1/2 h-3/4 md:h-1/2 bg-white rounded-lg shadow-md p-3 relative overflow-hidden flex flex-col justify-between">
        <h1 className="text-lg font-bold text-yellow-600 text-center lg:text-4xl md:text-2xl">
          YMCA Yellow Shoelace Fundraiser
        </h1>

        <div className="flex items-center justify-center flex-grow text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-500 mr-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ${displayAmount.toLocaleString()}
          </motion.div>
          <p className="text-lg text-yellow-600 md:text-2xl lg:text-4xl">
            raised!
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-4 flex items-center justify-between px-2 overflow-hidden">
          {[...Array(15)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="w-1 h-8 bg-yellow-300 rounded-full transform -skew-x-12" />
            </motion.div>
          ))}
        </div>

        <p className="text-yellow-800 text-xs text-center relative z-10">
          Get your yellow shoelaces and support us!
        </p>
      </div>
    </div>
  );
}
