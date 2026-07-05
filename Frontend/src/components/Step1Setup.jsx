import React from "react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import { motion } from "motion/react";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
function Step1Setup({ onStart }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { userData } = useSelector((state) => state.user);
const dispatch = useDispatch();

  const warmUpSpeechSynthesis = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.getVoices();

    const warmup = new SpeechSynthesisUtterance(".");
    warmup.volume = 0.01;
    window.speechSynthesis.speak(warmup);

    setTimeout(() => {
      window.speechSynthesis.cancel();
    }, 50);
  };

  const requestMicPermission = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log("Mic permission:", error);
    }
  };



  const handleUploadResume = async () => {
    setAnalyzing(true);

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        serverUrl + "/api/v1/interview/resume",
        formdata,
        { withCredentials: true },
      );

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    warmUpSpeechSynthesis();
    requestMicPermission();
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/v1/interview/generate-questions",
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true },
      );
      
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      setLoading(false);
      onStart(result.data);
    } catch (error) {
       alert(error.response?.data?.message || error.message);
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="premium-shell min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12"
    >
      <div className="glass-card w-full max-w-6xl rounded-[30px] sm:rounded-[36px] grid lg:grid-cols-[0.9fr_1.1fr] overflow-hidden">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#FCEEF2] via-[#FAF6F3] to-white p-6 sm:p-9 lg:p-12 flex flex-col justify-center"
        >
          <div className="absolute -left-20 top-8 h-48 w-48 rounded-full bg-[#D8A7B1]/35 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-56 w-56 rounded-full bg-[#9B4D6D]/15 blur-3xl" />
          <p className="relative mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#9B4D6D]">Interview Studio</p>
          <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#2B2024] mb-4 sm:mb-6">
            Start Your AI Interview
          </h2>

          <p className="relative text-[#6f5960] mb-7 sm:mb-10 leading-7">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence
          </p>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
            {[
              {
                icon: <FaUserTie className="text-[#9b3d55] text-xl" />,

                text: "Choose Role & Experience",
              },

              {
                icon: <FaMicrophoneAlt className="text-[#9b3d55] text-xl" />,

                text: "Smart Voice Interview",
              },

              {
                icon: <FaChartLine className="text-[#9b3d55] text-xl" />,

                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="glass-card flex items-center gap-3 sm:gap-4 p-4 rounded-2xl cursor-pointer"
              >
                {item.icon}
                <span className="text-[#2B2024] font-medium text-sm sm:text-base">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-5 sm:p-8 lg:p-12 bg-white/80"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2B2024] mb-2">
            Interview Setup
          </h2>
          <p className="mb-7 text-sm text-[#7d6970]">Tell the interviewer what role to simulate.</p>

          <div className="space-y-6">
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-[#9b3d55]" />

              <input
                type="text"
                placeholder="Enter role"
                className="premium-input w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none transition"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-[#9b3d55]" />

              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="premium-input w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none transition"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="premium-input w-full py-3.5 px-4 rounded-2xl outline-none transition"
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById("resumeUpload").click()}
              className="rounded-[24px] border border-dashed border-[#D8A7B1] bg-[#FAF6F3]/70 p-5 sm:p-8 text-center cursor-pointer hover:border-[#9B4D6D] hover:bg-[#FCEEF2] transition"
              >
                <FaFileUpload className="text-4xl mx-auto text-[#9b3d55] mb-3" />

                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />

                <p className="text-[#6e6963] font-medium break-words">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload resume (Optional)"}
                </p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="soft-button mt-4 px-5 py-2.5 text-sm font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[24px] p-5 space-y-4"
              >
                <h3 className="text-lg font-semibold text-[#2B2024]">
                  Resume Analysis Result
                </h3>

                {projects.length > 0 && (
                  <div>
                    <p className="font-medium text-[#2B2024] mb-1">Projects:</p>

                    <ul className="list-disc list-inside text-[#6f5960] space-y-1">
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-medium text-[#2B2024] mb-1">Skills:</p>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="bg-[#FCEEF2] text-[#7A2F43] px-3 py-1 rounded-full text-sm border border-[#EAD9DE]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="premium-button w-full py-4 text-lg font-semibold"
            >
              {loading ? "Starting..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1Setup;
