import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js"


const paymentRouter = express.Router()

paymentRouter.post("/order" , authMiddleware , createOrder )
paymentRouter.post("/verify" , authMiddleware , verifyPayment )


export default paymentRouter
