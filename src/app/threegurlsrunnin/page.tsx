"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Component() {
  // You can update this constant as needed
  const AMOUNT_RAISED = 173;

  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayAmount(AMOUNT_RAISED);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen bg-yellow-50 flex items-center justify-center p-4 ml-24">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600 mb-4 sm:mb-6 text-center">YMCA Yellow Shoelace Fundraiser</h1>
        <div className="relative sm:text-5xl md:text-6xl font-bold text-yellow-500 text-center mb-2 sm:mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ${displayAmount.toLocaleString()}
          </motion.div>
          <p className="text-lg sm:text-xl text-yellow-600 text-center mb-6 sm:mb-8">raised so far!</p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-6 sm:h-8 flex items-center justify-between px-2 sm:px-4 overflow-hidden">          {[...Array(20)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="w-1 sm:w-2 h-12 sm:h-16 bg-yellow-300 rounded-full transform -skew-x-12" />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center relative z-10">
          <p className="text-yellow-800 text-sm sm:text-base md:text-lg">Thank you for your support!</p>
        </div>
      </div>
    </div>
  );
}
