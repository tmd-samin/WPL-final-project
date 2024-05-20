import { guard } from "../../../guards.js";
import {
  IncrementalOperation,
  DailyOperation,
} from "../schemasOperations&Sales/operations.model.js";
import { getLoggedUserId } from "../../../config/config.js";
import { middlewareOperations } from "../../../middleware/middlewareOperations.js";

export default (app) => {
    app.put(
      "/api/dailyOperationAgentUpdate/:bizNumber",
      guard,
      async (req, res) => {
        const { userId, IsBusiness } = getLoggedUserId(req, res);

        if (!userId) {
          return res.status(403).json({ message: "User not authorized" });
        }

        let updateData = req.body;
        if (IsBusiness) {
          const { user_id, ...rest } = req.body;
          updateData = rest;
        }

        const { error } = middlewareOperations.validate(updateData);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

        try {
          const toIncrementalOperation =
            await IncrementalOperation.findOneAndUpdate(
              { bizNumber: req.params.bizNumber },
              updateData,
              { new: true }
            );

          const toDailyOperation = await DailyOperation.findOneAndUpdate(
            { bizNumber: req.params.bizNumber },
            updateData,
            { new: true }
          );

          if (!toIncrementalOperation && !toDailyOperation) {
            return res.status(404).json({ message: "Operation not found" });
          }

          res.send({ toDailyOperation, toIncrementalOperation });
        } catch (error) {
          res
            .status(500)
            .json({ message: "Server error", error: error.message });
        }
      }
    );
}