import bcrypt from "bcrypt";
import { User } from "./models/user.model.js";
import { middlewareUsers } from "../../middleware/middlewareUser.js";

const myAccount = (app) => {
  app.put("/api/user/:id", async (req, res) => {
    try {
      const { error } = middlewareUsers.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const userInfo = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isAdmin && userInfo.isAdmin) {
        const isPasswordCorrect = await bcrypt.compare(
          userInfo.password,
          user.password
        );
        if (!isPasswordCorrect) {
          return res
            .status(400)
            .json({ message: "The password is incorrect to update the details" });
        }
      }

      delete userInfo.password;
      Object.assign(user, userInfo);

      await user.save();
      res.status(200).send(`Details have been successfully updated${user.name.first} !! `);
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "There is an account with an email address!" });
      } else {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  });
};

export default myAccount;
