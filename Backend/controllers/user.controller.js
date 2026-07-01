import User from "../models/user.model.js"


const getCurrentUser = async (req, res) => {
    console.log("getCurrentUser controller called");

  try {
    const userId = req.userId;
    console.log("userId:", userId);

    const user = await User.findById(userId);
    console.log("user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentUser;