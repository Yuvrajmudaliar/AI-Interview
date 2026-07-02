import React from "react";
import { FaRobot } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { signInWithPopup } from "firebase/auth";
import { setUserData } from "../redux/userSlice.js";
import { useDispatch } from "react-redux";
import { useState } from "react";
// function Auth({ isModel = false }) {
function Auth({ isModel = false, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
//   const handleGoogleAuth = async () => {
//     try {
//       const response = await signInWithPopup(auth, provider);
//       let User = response.user;
//       let name = User.displayName;
//       let email = User.email;
//       const result = await axios.post(
//         serverUrl + "/api/v1/auth/google",
//         {
//           name,
//           email,
//         },
//         {
//           withCredentials: true,
//         },
//       );
//       dispatch(setUserData(result.data.user));
//       if (onClose) {
//   onClose();
// }
//     } catch (error) {
//       dispatch(setUserData(null));
//     }
//   };
const handleGoogleAuth = async () => {
  if (loading) return;

  setLoading(true);

  try {
   const response = await signInWithPopup(auth, provider);
const user = response.user;

const result = await axios.post(
  serverUrl + "/api/v1/auth/google",
  {
    name: user.displayName,
    email: user.email,
  },
  { withCredentials: true }
);

onClose?.();

// ✅ IMPORTANT: store FULL user from backend (credits included)
dispatch(setUserData(result.data.user));


  } catch (error) {
    console.error(error);
    dispatch(setUserData(null));
  } finally {
    setLoading(false);
  }
};
  return (
    <div

      className={`
    w-full
    ${isModel ? "py-4" : "min-h-screen bg-[#f6f1ea] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20"}
`}
    >
      <motion.div
        // initial={{ opacity: 0, y: -50 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.1 }}
        className={`
w-full
${isModel ? "max-w-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl" : "max-w-lg p-5 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[32px]"}
 bg-white/95 shadow-2xl shadow-[#7a2f43]/10 border border-[#eaded1]
`}
      >
        {/* Header Logo Section */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-[#2b2b2f] text-[#f0c36a] p-2 rounded-lg shadow-sm shadow-[#2b2b2f]/20">
            <FaRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg text-[#202124]">
            Yuvixa AI
          </h2>
        </div>

        {/* Centered Heading Section */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4 flex flex-col items-center gap-2 text-[#202124]">
          <span>Continue with</span>
          <span className="bg-[#ead8cf] text-[#7a2f43] px-3 py-1 rounded-full inline-flex items-center gap-2 text-base sm:text-lg md:text-2xl font-semibold">
            <IoSparkles size={16} />
            AI Smart Interview
          </span>
        </h1>

        <p className="text-[#6e6963] text-center text-sm md:text-base leading-relaxed mb-8">
          Sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </p>

        <motion.button
          onClick={handleGoogleAuth}
          disabled={loading}
          whileHover={{ opacity: 0.9, scale: 1.03 }}
          whileTap={{ opacity: 1, scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-3
        bg-[#7a2f43] text-white rounded-full shadow-md shadow-[#7a2f43]/20 hover:bg-[#642638] border border-[#642638]"
        >
          <FcGoogle size={20} />
           {loading ? "Signing in..." : "Continue with Google"}

        </motion.button>
      </motion.div>
    </div>
  );
}

export default Auth;
