import React from "react";

const LoadingScreen = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">

      {/* Animated glow orb */}
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-blue-500 blur-2xl opacity-40 animate-pulse"></div>

        {/* Spinner ring */}
        <div className="absolute w-16 h-16 border-4 border-gray-700 border-t-blue-400 rounded-full animate-spin"></div>
      </div>

      {/* Title */}
      <h1 className="mt-8 text-xl font-semibold tracking-wide">
        Preparing your AI workspace
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-sm mt-2 text-center max-w-xs">
        Setting up your session, please wait a moment...
      </p>

      {/* Animated dots */}
      <div className="flex gap-1 mt-5">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default LoadingScreen;