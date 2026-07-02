import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        console.log("Request URL:", req.originalUrl);
console.log("Cookies:", req.cookies);
console.log("Headers Cookie:", req.headers.cookie);
console.log("Token:", req.cookies?.token);
        const token = req.cookies?.token;
        



        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
};


export default authMiddleware;