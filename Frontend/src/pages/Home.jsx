import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

import {
  BsMic,
  BsRobot,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthModel from "../components/AuthModel.jsx";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer.jsx";

function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
  if (userData) {
    setShowAuth(false);
  }
}, [userData]);
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(216,167,177,0.28),transparent_28rem),linear-gradient(135deg,#FAF6F3_0%,#FFFFFF_100%)] flex flex-col text-[#2B2024]">
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
        <div className=" max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-white/90 text-[#2B2024] text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-2 border border-[#EAD9DE] shadow-sm shadow-[#7A2F43]/5 backdrop-blur text-center">
              <HiSparkles size={16} className="text-[#9B4D6D]" />
              AI-Powered Mock Interview Platform
            </div>
          </div>
          <div className="text-center mb-16 sm:mb-24 lg:mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto text-[#2B2024]"
            >
              Practice Interviews with
              <span className="relative inline-block mt-2 sm:mt-0 sm:ml-3">
                <span className="bg-white/90 text-[#7A2F43] px-3 sm:px-4 py-1 rounded-full shadow-sm shadow-[#7A2F43]/10 border border-[#EAD9DE]">
                  AI Interview Coach
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-[#2B2024] mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-8"
            >
              Practice role-based interviews with an AI interviewer,
              receive instant feedback, and improve your confidence.
            </motion.p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mt-10">
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="bg-gradient-to-r from-[#7A2F43] to-[#9B4D6D] text-white px-6 sm:px-10 py-3 rounded-full hover:from-[#642638] hover:to-[#7A2F43] transition shadow-lg shadow-[#7A2F43]/20 w-full sm:w-auto font-semibold"
              >
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="border border-[#EAD9DE] bg-white/90 text-[#2B2024] px-6 sm:px-10 py-3 rounded-full hover:border-[#D8A7B1] hover:text-[#7A2F43] transition shadow-sm shadow-[#7A2F43]/5 w-full sm:w-auto font-semibold backdrop-blur"
              >
                View History
              </motion.button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-stretch md:items-center gap-8 lg:gap-10 mb-16 sm:mb-24 lg:mb-28">
            {[
              {
                icon: <BsRobot size={24} />,
                step: "STEP 1",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficulty based on selected job role.",
              },
              {
                icon: <BsMic size={24} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers.",
              },
              {
                icon: <BsClock size={24} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, y: -8, scale: 1.03 }}
                className={`
relative bg-white/90 rounded-2xl sm:rounded-3xl border border-[#EAD9DE]
hover:border-[#D8A7B1] p-7 sm:p-8 lg:p-10 w-full sm:w-80 max-w-none shadow-lg shadow-[#7A2F43]/10
hover:shadow-2xl hover:shadow-[#7A2F43]/15 backdrop-blur
transition-all duration-300
${index === 0 ? "md:rotate-[-4deg]" : ""}
${index === 1 ? "md:rotate-[3deg] md:-mt-6 shadow-xl" : ""}
${index === 2 ? "md:rotate-[-3deg]" : ""}
`}
              >
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#7A2F43] to-[#9B4D6D] border-2
 border-white text-[#D8A7B1] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-[#7A2F43]/20"
                >
                  {item.icon}
                </div>
                <div className="pt-10 text-center">
                  <div className="text-xs text-[#9B4D6D] font-semibold mb-2 tracking-wider">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-3 text-lg text-[#2B2024]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#2B2024] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mb-16 sm:mb-24 lg:mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-14 lg:mb-16 text-[#2B2024]"
            >
              Advanced AI <span className="text-[#9B4D6D]">Capabilities</span>
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-10">
              {[
                {
                  image: evalImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy and confidence.",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Resume Based Interview",
                  desc: "Project-specific questions based on ",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Downloadable PDF Report",
                  desc: "Detailed strengths, weaknesses and improvement insights.",
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart size={20} />,
                  title: "History & Analytics",
                  desc: "Track progress with performance graphs and topic analysis.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="bg-white/90 border border-[#EAD9DE] rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-lg shadow-[#7A2F43]/10 hover:shadow-2xl hover:shadow-[#7A2F43]/15 hover:border-[#D8A7B1] transition-all backdrop-blur"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8">
                    <div className="w-full sm:w-1/2 flex justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto object-contain max-h-48 sm:max-h-56 lg:max-h-64 drop-shadow-lg"
                      />
                    </div>

                    <div className="w-full sm:w-1/2 text-center sm:text-left">
                      <div className="bg-[#FAF6F3] text-[#9B4D6D] w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-[#EAD9DE] shadow-sm">
                        {item.icon}
                      </div>

                      <h3 className="text-[#2B2024] font-semibold text-lg mb-2">{item.title}</h3>

                      <p className="text-[#2B2024] text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-16 sm:mb-24 lg:mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-14 lg:mb-16 text-[#2B2024]"
            >
              Multiple Interview <span className="text-[#9B4D6D]">Modes</span>
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-10">
              {[
                {
                  img: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and communication based evaluation.",
                },

                {
                  img: techImg,
                  title: "Technical Mode",
                  desc: "Deep technical questioning based on selected role.",
                },

                {
                  img: confidenceImg,
                  title: "Confidence Detection",
                  desc: "Basic tone and voice analysis insights.",
                },

                {
                  img: creditImg,
                  title: "Credits System",
                  desc: "Unlock premium interview sessions easily.",
                },
              ].map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white/90 border border-[#EAD9DE] rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-lg shadow-[#7A2F43]/10 hover:shadow-2xl hover:shadow-[#7A2F43]/15 hover:border-[#D8A7B1] transition-all backdrop-blur"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="w-full sm:w-1/2 text-center sm:text-left">
                      <h3 className="font-semibold text-xl mb-3 text-[#2B2024]">
                        {mode.title}
                      </h3>

                      <p className="text-[#2B2024] text-sm leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="w-full sm:w-1/2 flex justify-center sm:justify-end">
                      <img
                        src={mode.img}
                        alt={mode.title}
                        className="w-28 h-28 object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {!userData && showAuth && (
  <AuthModel onClose={() => setShowAuth(false)} />
)}
      <Footer />
    </div>
  );
}

export default Home;

