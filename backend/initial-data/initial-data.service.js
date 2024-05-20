import { User } from "../handlers/users/models/user.model.js";
import {
  IncrementalOperation,
  DailyOperation,
} from "../handlers/operation/schemasOperations&Sales/operations.model.js";
import { users, incrementalOperation, dailyOperation } from "./initial-data.js";
import bcrypt from "bcrypt";
import chalk from "chalk";

// upload the initial data to the database //
const initialDataStart = async () => {
  const userAmount = await User.find().countDocuments();

  if (!userAmount) {
    const userIds = [];

    for (const u of users) {
      u.password = await bcrypt.hash(u.password, 10);
      const user = new User(u);
      const obj = await user.save();

      if (obj.IsBusiness) {
        userIds.push(obj._id);
      }
    }
    console.log(
      chalk.bgYellowBright("the users in the initial data uploaded !")
    );

    for (const c of incrementalOperation) {
      const incrementalOperation = new IncrementalOperation(c);
      const i = Math.floor(Math.random() * userIds.length);
      incrementalOperation.user_id = userIds[i];
      await incrementalOperation.save();
    }
    console.log(
      chalk.bgYellowBright("the operation in the initial data uploaded !")
    );

    for (const c of dailyOperation) {
      const operationDay = new DailyOperation(c);
      const i = Math.floor(Math.random() * userIds.length);
      operationDay.user_id = userIds[i];
      await operationDay.save();
    }
    console.log(
      chalk.bgYellowBright("the operationDay in the initial data uploaded !")
    );
  }
};

export default initialDataStart;
