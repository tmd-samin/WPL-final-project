import jwt from "jsonwebtoken";
import chalk from "chalk";

// create a token for the user //
export const getLoggedUserId = (req, res) => {
  try {
    if (!req.headers.authorization) {
      return null;
    }

    // Split the Authorization header to extract the token
    const token = req.headers.authorization;

    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (!data) {
      return res.status(401).json({ message: "User not authorized" });
    }

    return data;
  } catch (error) {
  if (error instanceof jwt.TokenExpiredError) {
    console.error(chalk.bgRed("Token expired is time out"));
    return res.status(401).json({ message: "Token expired is time out" });
  }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



