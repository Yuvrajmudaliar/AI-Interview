import React, { useState, useRef, useEffect } from "react";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash, FaStar } from "react-icons/fa";
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
  const [interviewRating, setInterviewRating] = useState(0);
  const [interviewComment, setInterviewComment] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions?.[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
const hasStartedRef = useRef(false);
  const [subtitle, setSubtitle] = useState("");
  const videoRef = useRef(null);
 const [voicesReady, setVoicesReady] = useState(false);
const [micRunning, setMicRunning] = useState(false);

  const currentQuestion = questions?.[currentIndex];
 const micOnRef = useRef(true);
const aiPlayingRef = useRef(false);
const micRunningRef = useRef(false);
const micPermissionRequestedRef = useRef(false);
const selectedVoiceRef = useRef(null);
const isLastQuestion = currentIndex + 1 >= questions.length;


useEffect(() => {
  micOnRef.current = isMicOn;
}, [isMicOn]);

useEffect(() => {
  aiPlayingRef.current = isAIPlaying;
}, [isAIPlaying]);

useEffect(() => {
  micRunningRef.current = micRunning;
}, [micRunning]);

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

const getPreferredVoice = (availableVoices) => {
  if (!("speechSynthesis" in window)) return null;

  const voices = availableVoices || window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const englishVoices = voices.filter((voice) => voice.lang?.startsWith("en"));

return (
  englishVoices.find(isLikelyFemaleVoice) ||
  voices.find(isLikelyFemaleVoice) ||
  englishVoices.find((voice) => !isLikelyMaleVoice(voice)) ||
  englishVoices[0] ||
  voices.find((voice) => voice.default) ||
  voices[0]
);
};



useEffect(() => {
  let mounted = true;

  const loadVoices = () => {
    const femaleVoice = getPreferredVoice();

    if (!femaleVoice) return;
    if (!mounted) return;

    console.log("Voice Loaded:", femaleVoice?.name);

    selectedVoiceRef.current = femaleVoice;
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

const playAiVideo = () => {
  const video = videoRef.current;
  if (!video) return;

  video.play().catch((error) => {
    console.log("Video play error:", error);
  });
};

const pauseAiVideo = () => {
  const video = videoRef.current;
  if (!video) return;

  video.pause();
  video.currentTime = 0;
};

const waitForVoices = () =>
  new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();

    if (voices.length) {
      resolve(voices);
      return;
    }

    const interval = setInterval(() => {
      voices = speechSynthesis.getVoices();
      if (voices.length) {
        clearInterval(interval);
        resolve(voices);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      resolve(speechSynthesis.getVoices());
    }, 2000);
  });


  const speakText = async (text) => {
  console.log("🟢 speakText called");

  if (!("speechSynthesis" in window)) {
    setSubtitle(text);
    return Promise.resolve();
  }

  aiPlayingRef.current = true;
  setIsAIPlaying(true);
  stopMic();

  const voices = await waitForVoices();
  const preferredVoice = getPreferredVoice(voices);

  if (preferredVoice) {
    selectedVoiceRef.current = preferredVoice;
    setSelectedVoice(preferredVoice);
  }

  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  const voice =
    selectedVoiceRef.current ||
    preferredVoice ||
    selectedVoice ||
    voices.find((v) => v.lang === "en-US" && isLikelyFemaleVoice(v)) ||
    voices.find((v) => v.lang?.startsWith("en") && !isLikelyMaleVoice(v)) ||
    voices[0];

  if (voice) utterance.voice = voice;

  utterance.lang = "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  return new Promise((resolve) => {
  let settled = false;

  const finish = () => {
    if (settled) return;
    settled = true;

    aiPlayingRef.current = false;
    setIsAIPlaying(false);
    setSubtitle("");
    pauseAiVideo();

    if (micOnRef.current) {
      setTimeout(() => {
        startMic();
      }, 250);
    }

    resolve();
  };

  utterance.onstart = () => {
    console.log("🎙️ Speech Started");
    setSubtitle(text);
    aiPlayingRef.current = true;
    setIsAIPlaying(true);
    playAiVideo();
  };

  utterance.onend = () => {
    console.log("✅ Speech Ended");

    finish();
  };

  utterance.onerror = (e) => {
    console.log("❌ Speech Error:", e);
    finish();
  };

  setSubtitle(text);
  aiPlayingRef.current = true;
  setIsAIPlaying(true);
  playAiVideo();

  setTimeout(() => {
    speechSynthesis.speak(utterance);
    setTimeout(() => {
      if (!speechSynthesis.speaking && !speechSynthesis.pending) {
        finish();
      }
    }, 800);
  }, 100);
  });
};

useEffect(() => {
  const unlockSpeech = () => {
    speechSynthesis.getVoices();
    window.removeEventListener("click", unlockSpeech);
  };

  window.addEventListener("click", unlockSpeech);
}, []);
useEffect(() => {
  const startFlow = async () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    requestMicPermission();
    const voices = await waitForVoices();
    const preferredVoice = getPreferredVoice(voices);

    if (preferredVoice) {
      selectedVoiceRef.current = preferredVoice;
      setSelectedVoice(preferredVoice);
      setVoicesReady(true);
    }

    setIsIntroPhase(true);

    await speakText(
      `Hi ${userName}, welcome! It's great to meet you.`
    );

    await speakText(
      "I'll ask you a few questions. Answer naturally and take your time."
    );

    setIsIntroPhase(false);

    setTimeout(() => {
      setCurrentIndex(0);
    }, 300);
  };

  startFlow();
}, []);

  {
    /*Timer logic*/
  }
  useEffect(() => {
  if (isIntroPhase) return;
  if (!hasStartedRef.current) return;
  if (isAIPlaying) return;
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
}, [isIntroPhase, currentIndex, isAIPlaying]);

useEffect(() => {
  if (isIntroPhase) return;
  if (!hasStartedRef.current) return;
  if (!currentQuestion) return;
  if (isAIPlaying) return;

  speakText(currentQuestion.question);
}, [currentIndex, isIntroPhase]);


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
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎤 Mic Started");
    micRunningRef.current = true;
    setMicRunning(true);
  };

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript.trim() + " ";
      }
    }

    if (transcript.trim()) {
      setAnswer((prev) => `${prev} ${transcript}`.replace(/\s+/g, " ").trim());
    }
  };

  recognition.onerror = (e) => {
    console.log("Recognition Error:", e.error);

    micRunningRef.current = false;
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

    micRunningRef.current = false;
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


 
async function requestMicPermission() {
  if (micPermissionRequestedRef.current) return;
  micPermissionRequestedRef.current = true;

  if (!navigator.mediaDevices?.getUserMedia) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  } catch (err) {
    console.log("Mic permission:", err);
    setIsMicOn(false);
    micOnRef.current = false;
  }
}

function startMic() {
  if (!recognitionRef.current) return;

  if (micRunningRef.current) return;

  if (aiPlayingRef.current) return;

  try {
    recognitionRef.current.start();
  } catch (err) {
    console.log("Mic Start:", err.message);
  }
}



function stopMic() {
  if (!recognitionRef.current) return;

  try {
    recognitionRef.current.stop();
  } catch (err) {
    console.log(err);
  }

  micRunningRef.current = false;
  setMicRunning(false);
}

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

  if (isLastQuestion && interviewRating === 0) {
    setRatingError("Please select a star rating to finish the interview.");
    return;
  }

  setAnswer("");
  setFeedback("");

  if (currentIndex + 1 >= questions.length) {
    finishInterview();
    return;
  }

  await speakText("Alright, let's move to the next question.");

  setCurrentIndex((prev) => prev + 1);
};

  const finishInterview = async () => {
    if (interviewRating === 0) {
      setRatingError("Please select a star rating to finish the interview.");
      return;
    }

    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        serverUrl + "/api/v1/interview/finish",
        {
          interviewId,
          interviewRating,
          interviewComment,
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
              loop
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
                {isLastQuestion ? "Finish Interview" : "Next Question"} <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {feedback && isLastQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202124]/60 px-4 py-6 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl shadow-[#202124]/30 border border-[#eaded1]"
          >
            <div className="bg-[#7a2f43] px-6 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c36a]">
                Final Step
              </p>
              <h3 className="mt-2 text-2xl font-bold leading-tight">
                Rate your interview experience
              </h3>
              <p className="mt-2 text-sm text-[#f7e8df]">
                Your rating helps us improve the AI interview experience.
              </p>
            </div>

            <div className="p-6">
              <div className="mb-5 rounded-2xl border border-[#eaded1] bg-[#f9f5ef] p-4">
                <p className="text-sm font-semibold text-[#202124]">
                  How was your interview?
                </p>

                <div className="mt-4 flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setInterviewRating(star);
                        setRatingError("");
                      }}
                      className={`rounded-full p-2 text-3xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9b3d55] ${
                        star <= interviewRating
                          ? "bg-[#fff3cf] text-[#f0b83a] shadow-md shadow-[#f0c36a]/20"
                          : "bg-white text-[#d8c7b9] hover:text-[#f0b83a]"
                      }`}
                      aria-label={`Rate ${star} star`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>

                {ratingError && (
                  <p className="mt-3 text-center text-sm font-medium text-[#b42318]">
                    {ratingError}
                  </p>
                )}
              </div>

              <label className="mb-2 block text-sm font-semibold text-[#3e3a36]">
                Your feedback
              </label>
              <textarea
                value={interviewComment}
                onChange={(e) => setInterviewComment(e.target.value)}
                placeholder="Write your feedback here..."
                className="w-full min-h-28 rounded-2xl border border-[#eaded1] bg-white p-4 text-sm text-[#202124] outline-none resize-none transition focus:ring-2 focus:ring-[#9b3d55]"
              />

              <button
                onClick={handleNext}
                className="mt-5 w-full rounded-2xl bg-[#7a2f43] px-5 py-4 font-semibold text-white shadow-lg shadow-[#7a2f43]/20 transition hover:bg-[#642638]"
              >
                Submit Feedback & View Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Step2Interview;
