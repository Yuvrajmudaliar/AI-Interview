import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js"
import Interview from "../models/interview.model.js";

export const analyzeResume = async (req,res) => {
    try {
        if(!req.file){
            return res.status(400).json({ message: "Resume required" });
        }
        const filepath = req.file.path

        const fileBuffer = await fs.promises.readFile(filepath)
        const uint8Array = new Uint8Array(fileBuffer)

       const pdf = await pdfjsLib.getDocument({data:uint8Array}).
promise;

let resumeText = "";

// Extract text from all pages
for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items.map(item => item.str).join(" ");
    resumeText += pageText + "\n";
}


resumeText = resumeText
    .replace(/\s+/g, " ")
    .trim();

    const messages = [
    {
        role: "system",
        content: `
Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`
    },
    {
        role: "user",
        content: resumeText
    }
];

const aiResponse = await askAi(messages)

const parsed = JSON.parse(aiResponse);

fs.unlinkSync(filepath)


res.json({
    role: parsed.role,
    experience: parsed.experience,
    projects: parsed.projects,
    skills: parsed.skills,
    resumeText
});
        
    } catch (error) {
    console.error(error);

if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
}

 return res.status(500).json({ message: error.message });

    }
}


export const generateQuestion = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if(!role || !experience || !mode){
            return res.status(400).json({message:"Role, Experience and Mode are required."})
        }

        const user = await User.findById(req.userId)
console.log(user);
if (!user) {
    return res.status(404).json({
        message: "User not found."
    });
}


if (user.credits < 50) {
    return res.status(400).json({
        message: "Not enough credits. Minimum 50 required."
    });
}

const projectText = Array.isArray(projects) && projects.length
? projects.join(", ")
: "None";

const skillsText = Array.isArray(skills) && skills.length
? skills.join(", ")
: "None";

const safeResume = (resumeText || "").substring(0, 2000);

const userPrompt = `
Role:${role}
Experience:${experience}
InterviewMode:${mode}
Projects:${projectText}
Skills:${skillsText},
Resume:${safeResume}
`;

if (!userPrompt.trim()) {
    return res.status(400).json({
        message: "Prompt content is empty."
    });
}

const messages = [

      {
        role: "system",
        content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`
      }
      ,
      {
        role: "user",
        content: userPrompt
      }
    ];

console.time("OpenRouter");

const aiResponse = await askAi(messages);

console.timeEnd("OpenRouter");

if (!aiResponse || !aiResponse.trim()) {
    return res.status(500).json({
        message: "AI returned empty response."
    });
}


const questionsArray = aiResponse
    .split("\n")
    .map(q => q.trim())
    .filter(q => q.length > 0)
    .slice(0, 5);

if (questionsArray.length === 0) {
    return res.status(500).json({
        message: "AI failed to generate questions."
    });
}

user.credits -= 50;
await user.save();

const interview = await Interview.create({
    userId: user._id,
    role,
    experience,
    mode,
    resumeText: safeResume,
    questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy","easy","medium","medium","hard"][index],
        timeLimit: [60,60,90,90,120][index],
    }))
})

res.json({
    interviewId: interview._id,
    creditsLeft: user.credits,
    userName: user.name,
    questions: interview.questions
});

    } catch (error) {
return res.status(500).json({message:` Generate Question Error ${error}`});
    }
}

const createFallbackInterviewAnswer = (questionText = "") => {
  const topic = questionText
    .replace(/[?!.]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (topic.includes("project")) {
    return "In one of my projects, I focused on building a reliable solution with clean structure, practical features, and a smooth user experience. I handled the implementation carefully, tested the important flows, and improved the project based on real issues I found during development.";
  }

  if (topic.includes("frontend") || topic.includes("react") || topic.includes("ui")) {
    return "I have worked with frontend development by building responsive, user-friendly interfaces using React, JavaScript, HTML, and CSS. I focus on reusable components, clean state management, API integration, and making sure the interface feels smooth across different screen sizes.";
  }

  if (topic.includes("backend") || topic.includes("api") || topic.includes("database")) {
    return "I have experience working with backend concepts such as APIs, database operations, authentication, and server-side logic. I focus on writing reliable endpoints, handling data safely, and making sure the frontend can communicate with the backend smoothly.";
  }

  if (topic.includes("strength") || topic.includes("weakness") || topic.includes("challenge") || topic.includes("conflict")) {
    return "I handle professional situations by staying calm, understanding the problem clearly, and communicating openly with the people involved. I try to learn from each situation and use that experience to improve the way I work in future projects.";
  }

  return "I have practical experience with this area and focus on understanding the requirement clearly before solving the problem. I try to communicate my approach in a simple way, connect it with real work, and show how my skills can help me contribute effectively in the role.";
};

const generateInterviewReadyAnswer = async (questionText, submittedAnswer = "") => {
  try {
    const aiResponse = await askAi([
      {
        role: "system",
        content: `
Write ONLY a sample interview answer for the given question.

Rules:
- Natural, professional, conversational, and first-person.
- Specific to the question.
- Sounds like a strong candidate speaking directly in a real interview.
- 2 to 5 concise sentences.
- Do NOT explain how to answer.
- Do NOT give tips or meta commentary.
- Do NOT include phrases like "A correct answer should", "I would answer this by", "You should", or "The candidate should".
- Do NOT use bullet points.

Return ONLY valid JSON:
{
  "howToAnswer": "sample interview answer"
}
`
      },
      {
        role: "user",
        content: `
Question: ${questionText}
User's submitted answer: ${submittedAnswer || "No answer submitted."}
`
      }
    ]);

    const parsed = JSON.parse(aiResponse);
    return parsed.howToAnswer || createFallbackInterviewAnswer(questionText);
  } catch (error) {
    console.log("How to answer generation failed:", error);
    return createFallbackInterviewAnswer(questionText);
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body
    const submittedAnswer = typeof answer === "string" ? answer : "";

    const interview = await Interview.findById(interviewId)
    const question = interview.questions[questionIndex]

    // If no answer
    if (!submittedAnswer.trim()) {
        if (question.answer && question.answer.trim()) {
            return res.json({
                feedback: question.feedback || "Your answer has already been submitted.",
                howToAnswer: question.howToAnswer || ""
            });
        }

        question.score = 0;
        question.feedback = "You did not submit an answer.";
        question.answer = "";
        question.howToAnswer = await generateInterviewReadyAnswer(question.question, "");

        await interview.save();
        console.log(
  "Saved answer:",
  check.questions[questionIndex].answer
);

        return res.json({
            feedback: question.feedback
        });
    }
    // If time exceeded
if (timeTaken > question.timeLimit) {
    question.score = 0;
    question.feedback = "Time limit exceeded. Answer not evaluated.";
    question.answer = submittedAnswer;
    question.howToAnswer = await generateInterviewReadyAnswer(question.question, submittedAnswer);

    await interview.save();

    return res.json({
        feedback: question.feedback
    });
}



const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

How To Answer Rules:
- Write ONLY a sample answer the candidate can speak in a real interview.
- The answer must be natural, professional, conversational, and first-person.
- Tailor it specifically to the interview question.
- It must sound like a strong candidate answering the interviewer directly.
- Keep it concise: 2 to 5 sentences.
- Do NOT explain how to answer.
- Do NOT give tips or meta commentary.
- Do NOT include phrases like "A correct answer should", "I would answer this by", "You should", or "The candidate should".
- Do NOT use bullet points.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback",
  "howToAnswer": "sample interview answer"
}
`
      }
      ,
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${submittedAnswer}
`
      }
    ];


const aiResponse = await askAi(messages)


const parsed = JSON.parse(aiResponse);
const howToAnswer =
  parsed.howToAnswer ||
  createFallbackInterviewAnswer(question.question);

question.answer = submittedAnswer;
question.confidence = parsed.confidence;
question.communication = parsed.communication;
question.correctness = parsed.correctness;
question.score = parsed.finalScore;
question.feedback = parsed.feedback;
question.howToAnswer = howToAnswer;


await interview.save();
return res.status(200).json({feedback :parsed.feedback, howToAnswer})

} catch (error) {
return res.status(500).json({message:`failed to submit answer ${error}`})
}
}

export const finishInterview = async (req,res) => {
  try {
    const {interviewId, interviewRating = 0, interviewComment = ""} = req.body
    const interview = await Interview.findById(interviewId)
    if(!interview){
      return res.status(400).json({message:"failed to find Interview"})
    }

    const totalQuestions = interview.questions.length;

let totalScore = 0;
let totalConfidence = 0;
let totalCommunication = 0;
let totalCorrectness = 0;

for (const q of interview.questions) {
  if (!q.howToAnswer || !q.howToAnswer.trim()) {
    q.howToAnswer = await generateInterviewReadyAnswer(q.question, q.answer || "");
  }
}

interview.questions.forEach((q) => {
  totalScore += q.score || 0;
  totalConfidence += q.confidence || 0;
  totalCommunication += q.communication || 0;
  totalCorrectness += q.correctness || 0;
});

const finalScore = totalQuestions
  ? totalScore / totalQuestions
  : 0;

const avgConfidence = totalQuestions
  ? totalConfidence / totalQuestions
  : 0;

  const avgCommunication = totalQuestions
  ? totalCommunication / totalQuestions
  : 0;

const avgCorrectness = totalQuestions
  ? totalCorrectness / totalQuestions
  : 0;

interview.finalScore = finalScore;
interview.status = "completed";
interview.interviewRating = interviewRating;
interview.interviewComment = interviewComment;

await interview.save();

return res.status(200).json({
  finalScore: Number(finalScore.toFixed(1)),
  confidence: Number(avgConfidence.toFixed(1)),
  communication: Number(avgCommunication.toFixed(1)),
  correctness: Number(avgCorrectness.toFixed(1)),
  questionWiseScore: interview.questions.map((q) => ({
    question: q.question,
    answer: q.answer || "",
    howToAnswer: q.howToAnswer || "",
    score: q.score || 0,
    feedback: q.feedback || "",
    confidence: q.confidence || 0,
    communication: q.communication || 0,
    correctness: q.correctness || 0,
  })),
})
  } catch (error) {
return res.status(500).json({message:`failed to finish interview ${error}`})

  }
}



export const getMyInterviews = async (req,res) => {
  try {
    const interviews = await Interview.find({userId:req.userId})
    .sort({ createdAt: -1 })
    .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews)

  } catch (error) {
    return res.status(500).json({message:`failed to find currentUser Interview ${error}`})
  }
}

export const getInterviewReport = async (req,res) => {
  try {
    const interview = await Interview.findById(req.params.id)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" })
    }


    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    let reportUpdated = false;
    for (const q of interview.questions) {
      if (!q.howToAnswer || !q.howToAnswer.trim()) {
        q.howToAnswer = await generateInterviewReadyAnswer(q.question, q.answer || "");
        reportUpdated = true;
      }
    }

    if (reportUpdated) {
      await interview.save();
    }

    const avgConfidence = totalQuestions
  ? totalConfidence / totalQuestions
  : 0;

  const avgCommunication = totalQuestions
  ? totalCommunication / totalQuestions
  : 0;

const avgCorrectness = totalQuestions
  ? totalCorrectness / totalQuestions
  : 0;

  return res.status(200).json({
  finalScore: interview.finalScore,
  confidence: Number(avgConfidence.toFixed(1)),
  communication: Number(avgCommunication.toFixed(1)),
  correctness: Number(avgCorrectness.toFixed(1)),
  questionWiseScore: interview.questions.map((q) => ({
    question: q.question,
    answer: q.answer || "",
    howToAnswer: q.howToAnswer || "",
    score: q.score || 0,
    feedback: q.feedback || "",
    confidence: q.confidence || 0,
    communication: q.communication || 0,
    correctness: q.correctness || 0,
  }))
});
}catch(error){
  return res.status(500).json({message:`failed to find currentUser Interview Report ${error}`})
}
}
