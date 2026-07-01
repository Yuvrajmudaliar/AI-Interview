import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/connectDb.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import userRouter from './routes/user.route.js';
import interviewRouter from './routes/interview.route.js';
import paymentRouter from './routes/payment.route.js';
dotenv.config();

const app= express();
app.use(cors({
 origin: "https://ai-interview-1frontend.onrender.com",
  credentials: true

}))
app.use(express.json());
app.use(cookieParser());



/* 
Routes Managing
 */

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/interview',interviewRouter)
app.use('/api/v1/payment',paymentRouter)

const PORT=process.env.PORT||6000;
app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
    connectDb();
    
})
