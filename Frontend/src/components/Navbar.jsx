import React from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { FaRobot } from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
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
    <div className="bg-[#f6f1ea] flex justify-center px-3 sm:px-4 pt-4 sm:pt-6 relative z-[100]">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white/90 rounded-2xl sm:rounded-[24px] shadow-sm shadow-[#d7c7b8]/40
        border border-[#eaded1] px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-3 relative backdrop-blur"
      >
        <div
          onClick={() => {
            setShowCreditsPopup(false);
            setShowUserPopup(false);
            navigate("/");
          }}
          className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer"
        >
          <div className="bg-[#2b2b2f] text-[#f0c36a] p-2 rounded-lg shadow-sm shadow-[#2b2b2f]/20">
            <FaRobot size={18} />
          </div>

          <h1 className="font-semibold hidden sm:block text-base md:text-lg text-[#202124] truncate">
            Yuvixa AI
          </h1>
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
              className="flex items-center gap-1.5 sm:gap-2 bg-[#f2e6dc] text-[#7a2f43]
              px-2.5 sm:px-4 py-2 rounded-full text-sm hover:bg-[#ead8cf] transition border border-[#ead8c8]"
            >
              <BsCoin size={20} />

              {/* ✅ Fixed */}
              {userData?.credits || 0}
            </button>

            {showCreditsPopup && (
              <div
                className="absolute right-0 mt-3 w-[min(16rem,calc(100vw-1.5rem))]
                bg-white shadow-2xl shadow-[#7a2f43]/15 border border-[#eaded1] rounded-xl
                p-5 z-[120]"
              >
                <p className="text-sm text-[#6e6963] mb-4">
                  Need more credits to continue interviews?
                </p>

                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full bg-[#7a2f43] hover:bg-[#642638] text-white py-2 rounded-lg text-sm transition"
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
              className="w-9 h-9 bg-[#2b2b2f] text-[#f0c36a] rounded-full
              flex items-center justify-center font-semibold"
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
                shadow-2xl shadow-[#7a2f43]/15 border border-[#eaded1] rounded-xl
                p-4 z-[120]"
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
