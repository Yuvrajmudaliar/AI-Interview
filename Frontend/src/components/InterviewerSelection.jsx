import React from "react";
import { motion } from "motion/react";

function InterviewerSelection({ onSelect }) {

  return (
    <div className="min-h-screen bg-[#f6f1ea] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-[#7a2f43]">
          Choose Your AI Interviewer
        </h1>

        <p className="text-center text-gray-500 mt-3 mb-10">
          Select the interviewer you feel most comfortable with.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Female */}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: .97 }}
            onClick={() => onSelect("female")}
            className="cursor-pointer rounded-3xl border-2 border-pink-200 bg-pink-50 p-6 text-center shadow-lg hover:border-pink-400 transition"
          >

            <img
              src="   https://cdn-icons-png.flaticon.com/512/4140/4140051.png"
           
              alt="Female"
              className="w-40 mx-auto"
            />

            <h2 className="text-2xl font-bold mt-5 text-[#7a2f43]">
              Female Interviewer
            </h2>

            <p className="text-gray-600 mt-2">
              Friendly, professional and encouraging.
            </p>

          </motion.div>

          {/* Male */}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: .97 }}
            onClick={() => onSelect("male")}
            className="cursor-pointer rounded-3xl border-2 border-blue-200 bg-blue-50 p-6 text-center shadow-lg hover:border-blue-400 transition"
          >

            <img
              src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
              alt="Male"
              className="w-40 mx-auto"
            />

            <h2 className="text-2xl font-bold mt-5 text-[#1d4ed8]">
              Male Interviewer
            </h2>

            <p className="text-gray-600 mt-2">
              Confident, calm and professional.
            </p>

          </motion.div>

        </div>

      </div>
    </div>
  );
}

export default InterviewerSelection;