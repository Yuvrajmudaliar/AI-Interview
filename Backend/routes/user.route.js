import express from "express";
import getCurrentUser from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"

const userRouter = express.Router();

userRouter.get("/currentUser",authMiddleware,getCurrentUser)




export default userRouter;
