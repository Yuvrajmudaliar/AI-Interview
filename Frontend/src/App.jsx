import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import axios from "axios";
import { useEffect } from "react";
import { setUserData } from "./redux/userSlice.js";
import { useDispatch } from "react-redux";
import InterviewPage from "./pages/InterviewPage.jsx";
import InterviewReport from "./pages/InterviewReport.jsx";
import InterviewHistory from "./pages/InterviewHistory.jsx";
import Pricing from "./pages/Pricing.jsx";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
export const serverUrl = "https://ai-interview-p8wj.onrender.com";

function App() {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);
 useEffect(() => {
  const getUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/v1/user/currentUser", {
        withCredentials: true,
      });

      dispatch(setUserData(result.data.user));
    } catch (err) {
      dispatch(setUserData(null));
    } finally {
      setAuthLoading(false); // ✅ IMPORTANT
    }
  };

  getUser();
}, [dispatch]);

  if (authLoading) return <LoadingScreen />;
  
  return (
    <>
     <Toaster position="top-center" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
       <Route path="/interview" element={<InterviewPage />} />
       <Route path='/history' element={<InterviewHistory/>}/>
         <Route path='/pricing' element={<Pricing/>}/>
         <Route path='/report/:id' element={<InterviewReport/>}/>
    </Routes>
    </>
  );
}

export default App;
