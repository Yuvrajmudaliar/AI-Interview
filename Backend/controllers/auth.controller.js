import generateToken from "../config/token.js";
import User from "../models/user.model.js"

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        credits: 100, 
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 🔥 IMPORTANT: re-fetch full user from DB
    const freshUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      message: "Login Successful",
      user: freshUser,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Google Auth Function Error: ${error.message}`,
    });
  }
};

export const logout = async(req,res)=>{
    try {
        await res.clearCookie("token");
        return res.status(200).json({message:"Logout Successfully"})

    } catch (error) {
        return res.status(500).json({message:`Logout Error ${error} `});
    }
}