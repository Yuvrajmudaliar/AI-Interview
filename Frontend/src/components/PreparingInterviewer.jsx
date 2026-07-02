import React from "react";
import { motion } from "motion/react";
import { FaRobot } from "react-icons/fa";

function PreparingInterviewer() {
  return (
    <div className="min-h-screen bg-[#f6f1ea] flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
      >

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
          className="w-20 h-20 mx-auto rounded-full bg-[#7a2f43] flex items-center justify-center text-white"
        >
          <FaRobot size={35} />
        </motion.div>

        <h1 className="text-3xl font-bold mt-8 text-[#7a2f43]">
          Preparing your AI Interviewer...
        </h1>

        <p className="text-gray-500 mt-4">
          Please wait while we prepare your personalized interview.
        </p>

        <div className="flex justify-center gap-2 mt-8">

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="w-3 h-3 rounded-full bg-[#7a2f43]"
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            className="w-3 h-3 rounded-full bg-[#7a2f43]"
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
            className="w-3 h-3 rounded-full bg-[#7a2f43]"
          />

        </div>

      </motion.div>

    </div>
  );
}

export default PreparingInterviewer;