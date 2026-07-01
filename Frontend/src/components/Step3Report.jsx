import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "motion/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

function Step3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#6e6963] text-lg">Loading Report...</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // ============= TITLE =============
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(122, 47, 67);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    // underline
    doc.setDrawColor(122, 47, 67);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // ============== FINAL SCORE BOX ==============
    doc.setFillColor(242, 230, 220);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });

    currentY += 30;

    // ============= SKILLS BOX =============
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);

    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    // ============= ADVICE =============
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples. ";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples. ";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking clarity, and confident delivery. Practice answering aloud regularly.";

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220);
      doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220);
      doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

      doc.setFont("helvetica", "bold");
      doc.text("Professional Advice", margin + 10, currentY + 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
      doc.text(splitAdvice, margin + 10, currentY + 20);

      currentY += 50;

      // ============= QUESTION TABLE =============

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },

        head: [["#", "Question", "Score", "Feedback"]],

        body: questionWiseScore.map((q, i) => [
          i + 1,
          q.question,
          `${q.score}/10`,
          q.feedback,
        ]),

        styles: {
          fontSize: 9,
          cellPadding: 5,
          valign: "top",
        },

        headStyles: {
          fillColor: [122, 47, 67],
          textColor: 255,
          halign: "center",
          valign: "middle",
        },

        columnStyles: {
          0: {
            cellWidth: 12,
            halign: "center",
            valign: "top",
          },
          1: {
            cellWidth: 65,
            valign: "top",
          },
          2: {
            cellWidth: 19,
            halign: "center",
            valign: "top",
          },
          3: {
            cellWidth: "auto",
            valign: "top",
          },
        },

        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
      });

      doc.save("AI_Interview_Report.pdf");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1ea] px-3 sm:px-6 lg:px-10 py-6 sm:py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="md:mb-10 w-full flex items-start gap-3 sm:gap-4 min-w-0">
          <button
            onClick={() => navigate("/history")}
            className="mt-1 p-3 rounded-full bg-white shadow shadow-[#7a2f43]/10
       hover:shadow-md transition border border-[#eaded1]"
          >
            <FaArrowLeft className="text-[#6e6963]" />
          </button>

          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold leading-tight 
           text-[#202124]"
            >
              Interview Analytics Dashboard
            </h1>
            <p className="text-[#6e6963] mt-2 text-sm sm:text-base">
              AI-powered performance insights
            </p>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="w-full sm:w-auto bg-[#7a2f43] hover:bg-[#642638] text-white 
py-3 px-5 rounded-xl shadow-md shadow-[#7a2f43]/20 transition-all duration-300 font-semibold 
text-sm sm:text-base"
        >
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-[#7a2f43]/10 border border-[#eaded1] p-6 sm:p-8 text-center"
          >
            <h3 className="text-[#6e6963] mb-4 sm:mb-6 text-sm sm:text-base">
              Overall Performance
            </h3>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${score}`}
                styles={buildStyles({
                  textSize: "35px",
                  pathColor: "#7a2f43",
                  textColor: "#7a2f43",
                  trailColor: "#eaded1",
                })}
              />
            </div>
            <p className="text-[#8d8580] mt-3 text-xs sm:text-sm">Out of 10</p>

            <div className="mt-4">
              <p className="font-semibold text-[#202124] text-sm sm:text-base">
                {performanceText}
              </p>
              <p className="text-[#6e6963] text-xs sm:text-sm mt-1">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-[#7a2f43]/10 border border-[#eaded1] p-6 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-[#3e3a36] mb-6">
              Skill Evaluation
            </h3>

            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span>{s.label}</span>
                    <span className="font-semibold text-[#7a2f43]">
                      {s.value}
                    </span>
                  </div>
                  <div className="bg-[#eaded1] h-2 sm:h-3 rounded-full">
                    <div
                      className="bg-[#9b3d55] h-full rounded-full"
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-[#7a2f43]/10 border border-[#eaded1] p-5
  sm:p-8"
          >
            <h3
              className="text-base sm:text-lg font-semibold text-[#3e3a36]
  mb-4 sm:mb-6"
            >
              Performance Trend
            </h3>

            <div className="h-56 sm:h-72 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#9b3d55"
                    fill="#ead8cf"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-[#7a2f43]/10 border border-[#eaded1] p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-[#3e3a36] mb-6">
              Question Breakdown
            </h3>
            <div className="space-y-6">
              {questionWiseScore.map((q, i) => (
                <div
                  key={i}
                  className="bg-[#f9f5ef] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#eaded1]"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div>
                      <p className="text-xs text-[#8d8580]">Question {i + 1}</p>

                      <p className="font-semibold text-[#202124] text-sm sm:text-base leading-relaxed break-words">
                        {q.question || "Question not available"}
                      </p>
                    </div>
                    <div className="bg-[#ead8cf] text-[#7a2f43] px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit">
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className="bg-white border border-[#eaded1] p-4 rounded-lg">
                    <p className="text-xs text-[#9b3d55] font-semibold mb-1">
                      AI Feedback
                    </p>
                    <p className="text-sm text-[#3e3a36] leading-relaxed break-words">
                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;
