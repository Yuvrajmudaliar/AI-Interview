import React from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import toast from "react-hot-toast";

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setloadingPlan] = useState(null);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setloadingPlan(plan.id);
      const amountMap = {
        basic: 100,
        pro: 500,
      };

      const amount = amountMap[plan.id] || 0;

      const result = await axios.post(
        serverUrl + "/api/v1/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: result.data.amount,
        currency: "INR",
        name: "Yuvixa AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          try {
            const verifyPay = await axios.post(
              serverUrl + "/api/v1/payment/verify",
              response,
              { withCredentials: true },
            );

            dispatch(setUserData(verifyPay.data.user));

            toast.success("🎉 Payment successful! Credits added.");

            navigate("/");
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
          }
        },

        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setloadingPlan(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1ea] py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto mb-10 sm:mb-14 flex flex-col sm:flex-row items-start gap-4">
        <button
          onClick={() => navigate("/")}
          className="mt-2 p-3 rounded-full bg-white shadow shadow-[#7a2f43]/10 hover:shadow-md transition border border-[#eaded1]"
        >
          <FaArrowLeft className="text-[#6e6963]" />
        </button>

        <div className="text-center sm:text-left md:text-center w-full">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#202124]">
            Choose Your Plan
          </h1>
          <p className="text-[#6e6963] mt-3 text-sm sm:text-lg">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={!plan.default && { scale: 1.03 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-300 border
  ${
    isSelected
      ? "border-[#7a2f43] shadow-2xl shadow-[#7a2f43]/10 bg-white"
      : "border-[#eaded1] bg-white shadow-md shadow-[#7a2f43]/10"
  }
  ${plan.default ? "cursor-default" : "cursor-pointer"}
`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-[#7a2f43] text-white text-xs px-4 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-[#f2e6dc] text-[#7a2f43] text-xs px-3 py-1 rounded-full">
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-[#202124]">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span className="text-3xl font-bold text-[#7a2f43]">
                  {plan.price}
                </span>
                <p className="text-[#6e6963] mt-1">{plan.credits} Credits</p>
              </div>

              {/* Description */}
              <p className="text-[#6e6963] mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-[#9b3d55] text-sm" />
                    <span className="text-[#3e3a36] text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {!plan.default && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!isSelected) {
                      setSelectedPlan(plan.id);
                    } else {
                      handlePayment(plan);
                    }
                  }}
                  className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${
                    isSelected
                      ? "bg-[#7a2f43] text-white hover:bg-[#642638]"
                      : "bg-[#f2e6dc] text-[#7a2f43] hover:bg-[#ead8cf]"
                  }`}
                >
                  {isSelected ? "Proceed to Pay" : "select plan"}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;
