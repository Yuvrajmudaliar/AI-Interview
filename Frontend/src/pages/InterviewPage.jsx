// import React, { useState } from 'react'
// import Step1SetUp from '../components/Step1Setup.jsx'
// import Step2Interview from '../components/Step2Interview.jsx'
// import InterviewerSelection from "../components/InterviewerSelection.jsx";
// import Step3Report from '../components/Step3Report.jsx'
// import PreparingInterviewer from "../components/PreparingInterviewer";

// function InterviewPage() {
// const [step, setStep] = useState(1)
// const [interviewData, setInterviewData] = useState(null)
// const [interviewer,setInterviewer]=useState("female");
//   return (
//     <div className='min-h-screen bg-[#f6f1ea]'>
//     {/* {step===1 && (
//         <Step1SetUp onStart={(data)=>{
//             setInterviewData(data);
//             setStep(2)}}/>
//     )}

//     {step===2 && (
//         <Step2Interview interviewData={interviewData}
//         onFinish={(report)=>{setInterviewData(report)
//             setStep(3)
//         }}
//         />
//       )}

//       {step===3 && (
//         <Step3Report report={interviewData}/>
//     )} */}

//     {step===1 && (
//     <Step1SetUp
//       onStart={(data)=>{
//         setInterviewData(data);
//         setStep(2);
//       }}
//     />
// )}

// {step===2 && (
//     <InterviewerSelection
//       onSelect={(gender)=>{
//         setInterviewer(gender);
//         setStep(3);
//       }}
//     />
// )}

// {step===3 && (
//     <Step2Interview
//       interviewData={interviewData}
//       interviewer={interviewer}
//       onFinish={(report)=>{
//         setInterviewData(report);
//         setStep(4);
//       }}
//     />
// )}

// {step===4 && (
//     <Step3Report report={interviewData}/>
// )}

// </div>
//   )
// }

// export default InterviewPage

import React, { useState } from "react";
import Step1SetUp from "../components/Step1Setup.jsx";
import Step2Interview from "../components/Step2Interview.jsx";
import InterviewerSelection from "../components/InterviewerSelection.jsx";
import PreparingInterviewer from "../components/PreparingInterviewer.jsx";
import Step3Report from "../components/Step3Report.jsx";

function InterviewPage() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  const [interviewer, setInterviewer] = useState("female");

  return (
    <div className="min-h-screen bg-[#f6f1ea]">

      {/* STEP 1 - Interview Setup */}
      {step === 1 && (
        <Step1SetUp
          onStart={(data) => {
            setInterviewData(data);
            setStep(2);
          }}
        />
      )}

      {/* STEP 2 - Choose Interviewer */}
      {step === 2 && (
        <InterviewerSelection
          onSelect={(gender) => {
            setInterviewer(gender);

            // Show Preparing Screen
            setStep(3);

            // After 2.5 seconds start interview
            setTimeout(() => {
              setStep(4);
            }, 2500);
          }}
        />
      )}

      {/* STEP 3 - Preparing */}
      {step === 3 && <PreparingInterviewer />}

      {/* STEP 4 - Interview */}
      {step === 4 && (
        <Step2Interview
          interviewData={interviewData}
          interviewer={interviewer}
          onFinish={(report) => {
            setInterviewData(report);
            setStep(5);
          }}
        />
      )}

      {/* STEP 5 - Report */}
      {step === 5 && (
        <Step3Report report={interviewData} />
      )}

    </div>
  );
}

export default InterviewPage;
