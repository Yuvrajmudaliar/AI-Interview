import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
import { analyzeResume, finishInterview, generateQuestion, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/resume",authMiddleware,upload.single("resume"),analyzeResume)
interviewRouter.post("/generate-questions",authMiddleware,generateQuestion)
interviewRouter.post("/submit-answer",authMiddleware,submitAnswer)
interviewRouter.post("/finish",authMiddleware,finishInterview)
interviewRouter.get("/get-interview",authMiddleware,getMyInterviews)
interviewRouter.get("/report/:id",authMiddleware,getInterviewReport)



export default interviewRouter;
