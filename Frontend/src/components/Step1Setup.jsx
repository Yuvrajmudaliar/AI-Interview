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

    const warmup = new SpeechSynthesisUtterance(" ");
    warmup.volume = 0;
    window.speechSynthesis.speak(warmup);

    setTimeout(() => {
      window.speechSynthesis.cancel();
    }, 0);
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
      className="min-h-screen flex items-center justify-center bg-[#f6f1ea] px-3 sm:px-4 py-6 sm:py-8"
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-[#7a2f43]/10 border border-[#eaded1] grid lg:grid-cols-2 overflow-hidden">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-[#f2e6dc] p-5 sm:p-8 lg:p-12 flex flex-col justify-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#202124] mb-4 sm:mb-6">
            Start Your AI Interview
          </h2>

          <p className="text-[#6e6963] mb-6 sm:mb-10">
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
                className="flex items-center gap-3 sm:gap-4 bg-white/90 p-4
  rounded-xl shadow-sm shadow-[#7a2f43]/10 cursor-pointer border border-[#eaded1]"
              >
                {item.icon}
                <span className="text-[#3e3a36] font-medium text-sm sm:text-base">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-5 sm:p-8 lg:p-12 bg-white"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] mb-6 sm:mb-8">
            Interview SetUp
          </h2>

          <div className="space-y-6">
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-[#9b3d55]" />

              <input
                type="text"
                placeholder="Enter role"
                className="w-full pl-12 pr-4 py-3 border border-[#eaded1]
    rounded-xl focus:ring-2 focus:ring-[#9b3d55] outline-none
    transition"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-[#9b3d55]" />

              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="w-full pl-12 pr-4 py-3 border border-[#eaded1]
rounded-xl focus:ring-2 focus:ring-[#9b3d55] outline-none
transition"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full py-3 px-4 border border-[#eaded1] rounded-xl
focus:ring-2 focus:ring-[#9b3d55] outline-none transition"
            >
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
            </select>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById("resumeUpload").click()}
              className="border-2 border-dashed border-[#d8c7b9] rounded-xl p-5 sm:p-8 text-center cursor-pointer hover:border-[#9b3d55] hover:bg-[#f2e6dc] transition"
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
                    className="mt-4 bg-[#2b2b2f] text-white px-5 py-2 rounded-lg hover:bg-[#202124] transition"
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
                className="bg-[#f9f5ef] border border-[#eaded1] rounded-xl p-5 space-y-4"
              >
                <h3 className="text-lg font-semibold text-[#202124]">
                  Resume Analysis Result
                </h3>

                {projects.length > 0 && (
                  <div>
                    <p className="font-medium text-[#3e3a36] mb-1">Projects:</p>

                    <ul className="list-disc list-inside text-[#6e6963] space-y-1">
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-medium text-[#3e3a36] mb-1">Skills:</p>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="bg-[#ead8cf] text-[#7a2f43] px-3 py-1 rounded-full text-sm"
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
              className="w-full disabled:bg-[#8d8580] bg-[#7a2f43] hover:bg-[#642638] text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md shadow-[#7a2f43]/20"
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
