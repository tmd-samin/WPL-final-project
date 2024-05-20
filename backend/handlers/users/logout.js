import { getLoggedUserId } from "../../config/config.js";

const logout = (app) => {
  app.post("/logout", (req, res) => {
    try {
      if (!req.cookies.token) {
        return res.status(200).json({ message: "Already logged out" });
      }

      res.clearCookie('token'); // 'token' should be a string
      res.status(200).json({ message: "Logged out" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

export default logout;