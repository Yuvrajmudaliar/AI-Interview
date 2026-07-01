import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { FaArrowLeft } from "react-icons/fa";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/v1/interview/get-interview",
          { withCredentials: true },
        );

        setInterviews(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMyInterviews();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#f6f1ea]
py-10"
    >
      <div className="w-full max-w-5xl px-4 sm:px-6 mx-auto">
        <div className="mb-8 sm:mb-10 w-full flex flex-wrap items-start gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/")}
            className="mt-1 p-3 rounded-full bg-white shadow shadow-[#7a2f43]/10
hover:shadow-md transition border border-[#eaded1]"
          >
            <FaArrowLeft className="text-[#6e6963]" />
          </button>

          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold 
    text-[#202124]"
            >
              Interview History
            </h1>
            <p className="text-[#6e6963] mt-2 text-sm sm:text-base">
              Track your past interviews and performance reports
            </p>
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="bg-white p-6 sm:p-10 rounded-2xl shadow shadow-[#7a2f43]/10 text-center border border-[#eaded1]">
            <p className="text-[#6e6963]">
              No interviews found. Start your first interview.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {interviews.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/report/${item._id}`)}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-md shadow-[#7a2f43]/10
hover:shadow-xl transition-all duration-300 cursor-pointer border
border-[#eaded1] hover:border-[#d8b1a1]"
              >
                <div
                  className="flex flex-col md:flex-row md:items-center 
md:justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-[#202124]">
                      {item.role}
                    </h3>

                    <p className="text-[#6e6963] text-sm mt-1">
                      {item.experience} • {item.mode}
                    </p>

                    <p className="text-xs text-[#8d8580] mt-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 sm:gap-6">
                    {/* SCORE */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#7a2f43]">
                        {item.finalScore || 0}/10
                      </p>
                      <p className="text-xs text-[#8d8580]">Overall Score</p>
                    </div>

                    {/* STATUS BADGE */}
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${
                        item.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-[#fff3cc] text-[#8a6200]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;
