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
  const startInterview = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/interview");
  };

  const viewHistory = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate("/history");
  };

  return (
    <div className="premium-shell min-h-screen flex flex-col text-[#2B2024] overflow-hidden">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 pb-12 pt-28 sm:pt-32 lg:pt-36">
        <div className="max-w-6xl mx-auto">
          <section className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center min-h-[calc(100vh-9rem)] pb-12">
            <motion.div
              className="absolute -left-28 top-0 h-72 w-72 rounded-full bg-[#D8A7B1]/30 blur-3xl"
              animate={{ y: [0, 22, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-0 top-10 h-80 w-80 rounded-full bg-[#9B4D6D]/12 blur-3xl"
              animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#EAD9DE] bg-white/70 px-4 py-2 text-sm font-medium text-[#7A2F43] shadow-sm backdrop-blur"
              >
                <HiSparkles size={16} className="text-[#D8A7B1]" />
                AI-powered preparation for modern candidates
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-7 max-w-4xl text-5xl font-bold leading-[0.98] tracking-normal text-[#2B2024] sm:text-6xl lg:text-7xl"
              >
                Your Personal{" "}
                <span className="bg-gradient-to-r from-[#7A2F43] via-[#9B4D6D] to-[#D8A7B1] bg-clip-text text-transparent">
                  AI Interview Coach
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-[#6f5960]"
              >
                Practice realistic interviews with AI, receive instant feedback,
                improve confidence, and land your dream job.
              </motion.p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={startInterview}
                  whileTap={{ scale: 0.97 }}
                  className="premium-button px-7 py-4 text-base font-semibold"
                >
                  Start Interview
                </motion.button>

                <motion.button
                  onClick={viewHistory}
                  whileTap={{ scale: 0.97 }}
                  className="soft-button px-7 py-4 text-base font-semibold"
                >
                  View Dashboard
                </motion.button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
                {[
                  ["12k+", "Sessions"],
                  ["8.8", "Avg score"],
                  ["94%", "Confidence"],
                ].map(([value, label]) => (
                  <div key={label} className="glass-card rounded-3xl px-4 py-5">
                    <p className="text-2xl font-bold text-[#7A2F43]">{value}</p>
                    <p className="mt-1 text-xs font-medium text-[#7d6970]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 18 }}
              className="relative z-10 mx-auto w-full max-w-xl"
            >
              <div className="glass-card relative overflow-hidden rounded-[32px] p-5 sm:p-7">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7A2F43] via-[#D8A7B1] to-[#9B4D6D]" />
                <div className="rounded-[28px] bg-gradient-to-br from-[#FCEEF2] to-white p-6">
                  <img src={hrImg} alt="AI interview coach" className="mx-auto h-64 sm:h-80 object-contain drop-shadow-2xl" />
                </div>
              </div>

              {[
                ["top-8 -left-3 sm:-left-10", "Confidence", "92%", "⭐"],
                ["top-24 -right-2 sm:-right-8", "Score", "8.7", "🏆"],
                ["bottom-20 -left-2 sm:-left-8", "Progress", "+34%", "📈"],
                ["bottom-8 right-6", "AI Feedback", "Ready", "💡"],
              ].map(([pos, label, value, icon], index) => (
                <motion.div
                  key={label}
                  className={`glass-card absolute ${pos} rounded-3xl px-4 py-3`}
                  animate={{ y: [0, index % 2 ? 10 : -10, 0] }}
                  transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-xs text-[#7d6970]">{label}</p>
                      <p className="text-sm font-bold text-[#2B2024]">{value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section className="py-10 sm:py-16">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9B4D6D]">Workflow</p>
              <h2 className="mt-3 text-3xl sm:text-5xl font-bold text-[#2B2024]">Practice like it matters.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5 lg:gap-7">
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
                whileHover={{ y: -8 }}
                className="glass-card relative rounded-[28px] p-7 sm:p-8 transition-all duration-300"
              >
                <div
                  className="mb-6 bg-gradient-to-br from-[#7A2F43] to-[#9B4D6D] text-[#FFD700] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-[#7a2f43]/20"
                >
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs text-[#9B4D6D] font-semibold mb-2 tracking-wider">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-3 text-xl text-[#2B2024]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6f5960] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          </section>

          <section className="py-10 sm:py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl font-bold text-center mb-8 sm:mb-14 lg:mb-16"
            >
              Advanced AI <span className="text-[#9B4D6D]">Capabilities</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
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
                  desc: "Project-specific questions based on your resume.",
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
                {
                  image: confidenceImg,
                  icon: <BsMic size={20} />,
                  title: "Personalized Feedback",
                  desc: "Compact feedback with confidence, clarity and accuracy signals.",
                },
                {
                  image: creditImg,
                  icon: <BsClock size={20} />,
                  title: "Interview Streaks",
                  desc: "Keep practice consistent with a focused preparation habit.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-[28px] p-5 sm:p-7 transition-all"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-center rounded-3xl bg-[#FCEEF2]/70 p-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-36 object-contain"
                      />
                    </div>

                    <div>
                      <div className="bg-white text-[#9B4D6D] w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border border-[#EAD9DE] shadow-sm">
                        {item.icon}
                      </div>

                      <h3 className="text-[#2B2024] font-semibold text-lg mb-2">{item.title}</h3>

                      <p className="text-[#6f5960] text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="py-10 sm:py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl font-bold text-center mb-8 sm:mb-14 lg:mb-16"
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
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-[28px] p-5 sm:p-7 lg:p-8 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="w-full sm:w-1/2 text-center sm:text-left">
                      <h3 className="font-semibold text-xl mb-3 text-[#2B2024]">
                        {mode.title}
                      </h3>

                      <p className="text-[#6f5960] text-sm leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="w-full sm:w-1/2 flex justify-center sm:justify-end">
                      <img
                        src={mode.img}
                        alt={mode.title}
                        className="w-28 h-28 object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
      {!userData && showAuth && (
  <AuthModel onClose={() => setShowAuth(false)} />
)}
      <Footer />
    </div>
  );
}

export default Home;
