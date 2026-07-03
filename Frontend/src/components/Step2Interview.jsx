import React, { useState, useRef, useEffect } from "react";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { serverUrl } from "../App";
import axios from "axios";
import { BsArrowRight } from "react-icons/bs";




function Step2Interview({
  interviewData,
  onFinish
}) {
  const { interviewId, questions, userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions?.[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [subtitle, setSubtitle] = useState("");
  const videoRef = useRef(null);
  const [, setVoicesReady] = useState(false);
const [micRunning, setMicRunning] = useState(false);

  const currentQuestion = questions?.[currentIndex];
 const micOnRef = useRef(true);
const aiPlayingRef = useRef(false);


useEffect(() => {
  micOnRef.current = isMicOn;
}, [isMicOn]);

useEffect(() => {
  aiPlayingRef.current = isAIPlaying;
}, [isAIPlaying]);

const femaleVoiceNames = [
  "female",
  "zira",
  "jenny",
  "aria",
  "sonia",
  "susan",
  "samantha",
  "victoria",
  "karen",
  "moira",
  "tessa",
  "natasha",
  "google us english",
  "google uk english female",
];

const maleVoiceNames = ["male", "david", "mark", "guy", "george", "ryan"];

const isLikelyFemaleVoice = (voice) => {
  const name = voice?.name?.toLowerCase() || "";
  return femaleVoiceNames.some((femaleName) => name.includes(femaleName));
};

const isLikelyMaleVoice = (voice) => {
  const name = voice?.name?.toLowerCase() || "";
  return maleVoiceNames.some((maleName) => name.includes(maleName));
};

const getPreferredVoice = () => {
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const englishVoices = voices.filter((voice) => voice.lang?.startsWith("en"));

  return (
    englishVoices.find(isLikelyFemaleVoice) ||
    voices.find(isLikelyFemaleVoice) ||
    englishVoices.find((voice) => !isLikelyMaleVoice(voice)) ||
    englishVoices[0] ||
    voices.find((voice) => !isLikelyMaleVoice(voice)) ||
    voices[0]
  );
};

const waitForPreferredVoice = () => {
  const voice = getPreferredVoice();
  if (voice && isLikelyFemaleVoice(voice)) return Promise.resolve(voice);

  return new Promise(async (resolve) => {
    const finish = () => {
      speechSynthesis.removeEventListener?.("voiceschanged", handleVoicesChanged);
      resolve(getPreferredVoice());
    };

    const handleVoicesChanged = () => {
      const updatedVoice = getPreferredVoice();
      if (updatedVoice && isLikelyFemaleVoice(updatedVoice)) {
        clearTimeout(timeout);
        finish();
      }
    };

    const timeout = setTimeout(finish, 900);

    speechSynthesis.addEventListener?.("voiceschanged", handleVoicesChanged);
  });
};

useEffect(() => {
  let mounted = true;

  const loadVoices = () => {
    const femaleVoice = getPreferredVoice();

    if (!femaleVoice) return;
    if (!mounted) return;

    console.log("Voice Loaded:", femaleVoice?.name);

    setSelectedVoice(femaleVoice);
    setVoicesReady(true);
  };

  // Try immediately
  loadVoices();

  // Also listen for Chrome when voices load later
  speechSynthesis.onvoiceschanged = loadVoices;

  return () => {
    mounted = false;
    speechSynthesis.onvoiceschanged = null;
    speechSynthesis.cancel();
  };
}, []);
const videoSource = femaleVideo;


const speakText = (text) => {
    console.log("🟢 speakText called:", Date.now());
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis not supported");
      resolve();
      return;
    }

    stopMic();

    // Cancel only if something is already speaking
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const voice = selectedVoice || await waitForPreferredVoice();
    const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "en-US";

// Only assign the voice if one was found
if (voice) {
  utterance.voice = voice;
}
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => {
    console.log("🎙️ Speech Started");
  console.log("🟢 Speech actually started:", Date.now());
      setSubtitle(text);
      setIsAIPlaying(true);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    };

    utterance.onend = () => {
      console.timeEnd("Speech");
      console.log("✅ Speech Finished");

      setIsAIPlaying(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      
        if (micOnRef.current) {
          startMic();
        }

         setSubtitle("");
  resolve();
      
    };

    utterance.onerror = (e) => {
      console.log("Speech Error:", e);

      setIsAIPlaying(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      setSubtitle("");
      resolve();
    };

    console.time("Speech");
if (window.speechSynthesis.speaking) {
  window.speechSynthesis.cancel();
}

window.speechSynthesis.resume();
window.speechSynthesis.speak(utterance);
  });
};
useEffect(() => {
  const runIntro = async () => {
    if (isIntroPhase) {
      await speakText(
        `Hi ${userName}, welcome! It's great to meet you. I hope you're ready to begin.`,
      );

      await speakText(
        "I'll ask you a few questions. Answer naturally, take your time, and do your best. Let's begin.",
      );

      setIsIntroPhase(false);
  startMic();
    } else if (currentQuestion) {
      

      // If last question (hard level)

      if (currentIndex === questions.length - 1) {
        await speakText(
          "Alright, this one might be a bit more challenging. ",
        );
      }

      await speakText(currentQuestion.question);
    }
  };

  runIntro();
}, [isIntroPhase, currentIndex]);

  {
    /*Timer logic*/
  }
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);




useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.log("Speech Recognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎤 Mic Started");
    setMicRunning(true);
  };

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }

    setAnswer((prev) => prev + transcript);
  };

  recognition.onerror = (e) => {
    console.log("Recognition Error:", e.error);

    setMicRunning(false);

    if (
      e.error === "no-speech" ||
      e.error === "audio-capture" ||
      e.error === "network"
    ) {
      setTimeout(() => {
        if (micOnRef.current && !aiPlayingRef.current) {
          startMic();
        }
      }, 500);
    }
  };

  recognition.onend = () => {
    console.log("🎤 Mic Ended");

    setMicRunning(false);

    if (micOnRef.current && !aiPlayingRef.current) {
      console.log("Restarting Mic...");

      setTimeout(() => {
        startMic();
      }, 400);
    }
  };

  recognitionRef.current = recognition;

  return () => {
    recognition.stop();
  };
}, []);


 
const startMic = () => {
  if (!recognitionRef.current) return;

  if (micRunning) return;

  if (aiPlayingRef.current) return;

  try {
    recognitionRef.current.start();
  } catch (err) {
    console.log("Mic Start:", err.message);
  }
};



const stopMic = () => {
  if (!recognitionRef.current) return;

  try {
    recognitionRef.current.stop();
  } catch (err) {
    console.log(err);
  }

  setMicRunning(false);
};

 const toggleMic = () => {
  if (isMicOn) {
    stopMic();
    setIsMicOn(false);
  } else {
    setIsMicOn(true);

    setTimeout(() => {
      startMic();
    }, 100);
  }
};

  const submitAnswer = async () => {
    if (isSubmitting) return false;

    stopMic();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const result = await axios.post(
        serverUrl + "/api/v1/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      await speakText(result.data.feedback);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
const handleNext = async () => {
  setIsSubmitting(false);   // <-- Add this

  setAnswer("");
  setFeedback("");

  if (currentIndex + 1 >= questions.length) {
    finishInterview();
    return;
  }

  await speakText("Alright, let's move to the next question.");

  setCurrentIndex((prev) => prev + 1);

  setTimeout(() => {
  if (micOnRef.current) {
    startMic();
  }
}, 300);
};

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        serverUrl + "/api/v1/interview/finish",
        {
          interviewId,
        },
        { withCredentials: true },
      );

      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-[#f6f1ea] p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-[#7a2f43]/10 border border-[#eaded1] flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-3 sm:p-4 lg:p-6 gap-4 border-b lg:border-b-0 lg:border-r border-[#eaded1]">
          {/* Video */}
          <div className="w-full max-w-sm lg:max-w-md rounded-2xl overflow-hidden shadow-xl shadow-[#7a2f43]/10">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full aspect-video lg:aspect-auto h-auto object-cover"
            />
          </div>

          {/* subtitle */}
          {subtitle && (
            <div className="w-full max-w-md bg-[#f9f5ef] border border-[#eaded1] rounded-xl p-4 shadow-sm">
              <p className="text-[#3e3a36] text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {/* Status Card */}
          <div className="w-full bg-white border border-[#eaded1] rounded-2xl shadow-md shadow-[#7a2f43]/10 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6e6963]">Interview Status</span>

              {isAIPlaying && (
                <span className="text-sm font-semibold text-[#9b3d55]">
                  {isAIPlaying ? "AI Speaking" : ""}
                </span>
              )}
            </div>

            <div className="h-px bg-[#eaded1]"></div>

            <div className="flex justify-center py-2">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="h-px bg-[#eaded1]"></div>

            <div className="flex justify-around text-center">
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold text-[#7a2f43]">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-[#8d8580]">Current Question</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-bold text-[#7a2f43]">
                  {questions.length}
                </span>
                <span className="text-xs text-[#8d8580]">Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#7a2f43] mb-4 lg:mb-6">
            AI Smart Interview
          </h2>

          {/* Question Box */}
          {!isIntroPhase && (
            <div className="mb-4 lg:mb-6 bg-[#f9f5ef] p-4 sm:p-6 rounded-2xl border border-[#eaded1] shadow-sm">
              <p className="text-xs sm:text-sm text-[#8d8580] mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <div className="text-base sm:text-lg font-semibold text-[#202124] leading-relaxed">
                {currentQuestion?.question}
              </div>
            </div>
          )}

          {/* Answer */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-44 sm:min-h-[220px] lg:flex-1 bg-[#f9f5ef] p-4 sm:p-6 rounded-2xl resize-none outline-none border
             border-[#eaded1] focus:ring-2 focus:ring-[#9b3d55] transition text-[#202124]"
          />

          {/* Buttons */}
          {!feedback ? (
            <div className="flex items-center gap-3 sm:gap-4 mt-4 lg:mt-6">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 lg:w-14 lg:h-14 shrink-0 flex items-center justify-center rounded-full bg-[#2b2b2f] text-[#f0c36a] shadow-lg shadow-[#2b2b2f]/20"
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                onClick={submitAnswer}
                className={`min-w-0 flex-1 bg-[#7a2f43] text-white px-3 py-3 lg:py-4 
              rounded-2xl shadow-lg shadow-[#7a2f43]/20 hover:bg-[#642638] transition font-semibold disabled:bg-[#8d8580]
              flex-1 py-3 lg:py-4 rounded-2xl shadow-lg transition font-semibold
    ${
      isSubmitting
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-[#7a2f43] hover:bg-[#642638] text-white shadow-[#7a2f43]/20 cursor-pointer"
    }
              `}
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-[#f2e6dc] border border-[#ead8c8] p-5 rounded-2xl shadow-sm"
            >
              <p className="text-[#7a2f43] font-medium mb-4">{feedback}</p>

              <button
                onClick={handleNext}
                className="w-full bg-[#7a2f43] hover:bg-[#642638] text-white py-3 rounded-xl shadow-md shadow-[#7a2f43]/20 transition flex items-center justify-center gap-1"
              >
                Next Question <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
