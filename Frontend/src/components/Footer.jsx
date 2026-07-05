import React from "react";
import { BsRobot, BsStars } from "react-icons/bs";

function Footer() {
  return (
    <div className="premium-shell flex justify-center px-4 pb-10 pt-6">
      <div className="glass-card w-full max-w-6xl rounded-[28px] py-8 px-5 text-center">
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-[#7A2F43] to-[#9B4D6D] text-[#FFD700] p-2.5 rounded-2xl shadow-lg shadow-[#7a2f43]/20">
            <BsRobot size={16} />
          </div>
          <h2 className="font-semibold text-[#2B2024]">Yuvixa AI</h2>
          <BsStars className="text-[#D8A7B1]" />
        </div>
        <p className="text-[#6f5960] text-sm max-w-xl mx-auto leading-6">
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>
      </div>
    </div>
  );
}

export default Footer;
