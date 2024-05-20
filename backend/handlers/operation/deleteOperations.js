import { guard } from "../../guards.js";
import {
  IncrementalOperation,
  DailyOperation,
} from "./schemasOperations&Sales/operations.model.js";
import { getLoggedUserId } from "../../config/config.js";
import {
  DailyOperationSale,
  IncrementalOperationSale,
} from "./schemasOperations&Sales/operationSale.model.js";
import { middlewareSales } from "../../middleware/middlewareSale.js";
import moment from "moment";

export default (app) => {
  app.delete(
    "/api/dailyOperationAgentEnd/:bizNumber",
    guard,
    async (req, res) => {
      const { userId } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }

      const bizNumber = req.params.bizNumber;

      try {
        const dailyOperation = await DailyOperation.findOne({
          bizNumber: bizNumber,
        });
        const incrementalOperation = await IncrementalOperation.findOne({
          bizNumber: bizNumber,
        });

        if (!dailyOperation || !incrementalOperation) {
          return res.status(404).json({ message: "Operation not found" });
        }

        await DailyOperation.deleteOne({ bizNumber: bizNumber });
        await IncrementalOperation.deleteOne({ bizNumber: bizNumber });

        res.send({ message: "Operation deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  );

  app.delete(
    "/api/dailyOperationStartSale/:bizNumber",
    guard,
    async (req, res) => {
      const { userId, IsBusiness } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }

      try {
        const toIncrementalOperationSale =
          await IncrementalOperationSale.findOne({
            bizNumber: req.params.bizNumber,
          });
        const toDailyOperationSale = await DailyOperationSale.findOne({
          bizNumber: req.params.bizNumber,
        });

        if (!toIncrementalOperationSale || !toDailyOperationSale) {
          return res.status(404).json({ message: "Operation not found" });
        }

        if (
          (toIncrementalOperationSale &&
            toIncrementalOperationSale.user_id.toString() !== userId &&
            !IsBusiness) ||
          (toDailyOperationSale &&
            toDailyOperationSale.user_id.toString() !== userId &&
            !IsBusiness)
        ) {
          return res
            .status(403)
            .json({ message: "User not authorized to delete this operation" });
        }

        const createTime = moment(
          toIncrementalOperationSale.createTime
        ).startOf("day");
        const incrementalOperation = await IncrementalOperation.findOne({
          user_id: toIncrementalOperationSale.user_id,
          createTime: {
            $gte: new Date(createTime),
            $lt: new Date(moment(createTime).add(1, "days")),
          },
        });

        const dailyOperation = await DailyOperation.findOne({
          user_id: toDailyOperationSale.user_id,
          createTime: {
            $gte: new Date(createTime),
            $lt: new Date(moment(createTime).add(1, "days")),
          },
        });

        if (incrementalOperation) {
          incrementalOperation.sellerFiber -=
            toIncrementalOperationSale.sellerFiber;
          incrementalOperation.sellerTV -= toIncrementalOperationSale.sellerTV;
          incrementalOperation.easyMesh -= toIncrementalOperationSale.easyMesh;
          incrementalOperation.upgradeProgress -=
            toIncrementalOperationSale.upgradeProgress;
          await incrementalOperation.save();
        }

        if (dailyOperation) {
          dailyOperation.sellerFiber -= toDailyOperationSale.sellerFiber;
          dailyOperation.sellerTV -= toDailyOperationSale.sellerTV;
          dailyOperation.easyMesh -= toDailyOperationSale.easyMesh;
          dailyOperation.upgradeProgress -=
            toDailyOperationSale.upgradeProgress;
          await dailyOperation.save();
        }

        await IncrementalOperationSale.findOneAndDelete({
          bizNumber: req.params.bizNumber,
        });
        await DailyOperationSale.findOneAndDelete({
          bizNumber: req.params.bizNumber,
        });

        res.send({ message: "Operation deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  );
};
