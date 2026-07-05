import React from "react";
import { BsRobot } from "react-icons/bs";

function Footer() {
  return (
    <div className="bg-[#f6f1ea] flex justify-center px-4 pb-10 py-4 pt-10">
      <div className="w-full max-w-6xl bg-white/90 rounded-[24px] shadow-sm shadow-[#d7c7b8]/40 border border-[#eaded1] py-8 px-3 text-center">
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="bg-[#2b2b2f] text-[#f0c36a] p-2 rounded-lg shadow-sm shadow-[#2b2b2f]/20">
            <BsRobot size={16} />
          </div>
          <h2 className="font-semibold text-[#202124]">Yuvixa AI</h2>
        </div>
        <p className="text-[#6e6963] text-sm max-w-xl mx-auto">
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>
      </div>
    </div>
  );
}

export default Footer;
