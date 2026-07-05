import React from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { FaRobot } from "react-icons/fa";
import { BsCoin, BsStars } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setUserData } from "../redux/userSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import AuthModel from "./AuthModel.jsx";

function Navbar() {
  const state = useSelector((state) => state);
  const userData = state.user.userData;
  console.log("Navbar userData:", userData);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/v1/auth/logout", {
        withCredentials: true,
      });

      dispatch(setUserData(null));

      setShowCreditsPopup(false);
      setShowUserPopup(false);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 flex justify-center px-3 sm:px-5 pt-3 sm:pt-5 z-[100]">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="glass-card w-full max-w-6xl rounded-[22px] sm:rounded-[28px] px-3 sm:px-5 lg:px-6 py-3 flex justify-between items-center gap-3 relative"
      >
        <div
          onClick={() => {
            setShowCreditsPopup(false);
            setShowUserPopup(false);
            navigate("/");
          }}
          className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer"
        >
          <div className="bg-gradient-to-br from-[#7A2F43] to-[#9B4D6D] text-[#FFD700] p-2.5 rounded-2xl shadow-lg shadow-[#7a2f43]/20">
            <FaRobot size={18} />
          </div>

          <h1 className="font-semibold hidden sm:block text-base md:text-lg text-[#2B2024] truncate">
            Yuvixa AI
          </h1>
          <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-[#EAD9DE] bg-white/55 px-3 py-1 text-xs font-medium text-[#9B4D6D]">
            <BsStars /> Interview Coach
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6 relative">
          {/* Credits */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }

                setShowUserPopup(false);
                setShowCreditsPopup(!showCreditsPopup);
              }}
              className="flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-[#EAD9DE] bg-[#FCEEF2]/80 text-[#7A2F43]
              px-3 sm:px-4 py-2 text-sm font-semibold hover:bg-white transition shadow-sm shadow-[#7a2f43]/10"
            >
              <BsCoin size={20} />

              {/* ✅ Fixed */}
              {userData?.credits || 0}
            </button>

            {showCreditsPopup && (
              <div
                className="absolute right-0 mt-3 w-[min(16rem,calc(100vw-1.5rem))]
                glass-card rounded-3xl p-5 z-[120]"
              >
                <p className="text-sm text-[#6e6963] mb-4">
                  Need more credits to continue interviews?
                </p>

                <button
                  onClick={() => navigate("/pricing")}
                  className="premium-button w-full py-2.5 text-sm font-semibold"
                >
                  Buy more credits
                </button>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }

                setShowCreditsPopup(false);
                setShowUserPopup(!showUserPopup);
              }}
              className="w-10 h-10 bg-gradient-to-br from-[#7A2F43] to-[#9B4D6D] text-white rounded-2xl
              flex items-center justify-center font-semibold shadow-lg shadow-[#7a2f43]/20 transition hover:-translate-y-0.5"
            >
              {userData ? (
                // ✅ Fixed
                userData.name?.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={16} />
              )}
            </button>

            {showUserPopup && (
              <div
                className="absolute right-0 mt-3 w-[min(13rem,calc(100vw-1.5rem))] bg-white
                glass-card rounded-3xl p-4 z-[120]"
              >
                {/* ✅ This was already correct */}
                <p className="text-[#202124] text-sm font-medium break-words">
                  {userData?.name}
                </p>

                <button
                  onClick={() => navigate("/history")}
                  className="w-full text-left text-sm py-2
                  hover:text-[#7a2f43] text-[#6e6963]"
                >
                  Interview History
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm py-2
                  flex items-center gap-2 text-red-500"
                >
                  <HiOutlineLogout />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Navbar;
