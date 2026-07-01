import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Auth from "../pages/Auth.jsx";

function AuthModel({ onClose }) {
  // Extracted directly (adjust according to your exact Redux state structure)
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]); // Added proper dependencies

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#202124]/25 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-8 right-5 text-[#6e6963] hover:text-[#7a2f43] text-xl"
        >
          <FaTimes size={18} />
        </button>
        {/* <Auth isModel={true} /> */}
        <Auth isModel={true} onClose={onClose} />
      </div>
    </div>
  );
}

export default AuthModel;
