import jwt from "jsonwebtoken";
import { getLoggedUserId } from "./config/config.js";
import chalk from "chalk";

// verify the token for the user as guard //
export const guard = (req, res, next) => {
  try {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, data) => {
        if (err) {
          res.status(401).send("User not authorized , need to login");
          console.error(chalk.bgRed("User not authorized , need to login"));
        } else {
          next();
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// verify the token for the user as businessGuard //
export const businessGuard = (req, res, next) => {
  try {
    const userData = getLoggedUserId(req, res);

    if (!userData) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    const { IsBusiness, isAdmin } = userData;

    if (IsBusiness || isAdmin) {
      next();
    } else {
      res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// verify the token for the user as adminGuard //
export const adminGuard = (req, res, next) => {
  try {
    const user = getLoggedUserId(req, res);

    if (!user) {
      return res
        .status(401)
        .json({ message: "you don't have permission to do this" });
    }

    const { userId, isAdmin } = getLoggedUserId(req, res);

    if (isAdmin || userId === req.params.id) {
       return next();
    } else {
      res.status(401).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
