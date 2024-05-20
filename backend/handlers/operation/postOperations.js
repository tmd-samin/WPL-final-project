import { guard } from "../../guards.js";
import {
  IncrementalOperation,
  DailyOperation,
} from "./schemasOperations&Sales/operations.model.js";
import { getLoggedUserId } from "../../config/config.js";
import { middlewareOperations } from "../../middleware/middlewareOperations.js";
import {
  DailyOperationSale,
  IncrementalOperationSale,
} from "./schemasOperations&Sales/operationSale.model.js";
import { middlewareSales } from "../../middleware/middlewareSale.js";
import rateLimit from "express-rate-limit";

export default (app) => {
const postLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1,
  keyGenerator: function (req, res) {
    const {userId} = getLoggedUserId(req, res);
    return userId;
  },
  handler: function (req, res) {
    res.status(403).json({
      message:
      "One operation per 24 hours is allowed, please try again later",
    });
  },
});
  
  app.post(
    "/api/dailyOperationAgentStart",
    guard,
    postLimit,
    async (req, res) => {
      
      const { userId } = getLoggedUserId(req, res);
      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }

      req.body.user_id = userId;

      const { error } = middlewareOperations.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const bizNumber = await IncrementalOperation.generateUniqueBizNumber();
      req.body.bizNumber = bizNumber;
      req.body.sellerFiber = 0;
      req.body.sellerTV = 0;
      req.body.easyMesh = 0;
      req.body.upgradeProgress = 0;
      req.body.targets = 0;

      const startDayOperation = new DailyOperation(req.body);
      const incrementalOperation = new IncrementalOperation(req.body);

      try {
        const toIncrementalOperation = await incrementalOperation.save();
        const toDailyOperation = await startDayOperation.save();
        res.send({ toIncrementalOperation, toDailyOperation });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  );

  app.post("/api/dailyOperationStartSale", guard, async (req, res) => {
    const { userId } = getLoggedUserId(req, res);

    if (!userId) {
      return res.status(403).json({ message: "User not authorized" });
    }

    req.body.user_id = userId;

    const { error } = middlewareSales.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const bizNumber = await IncrementalOperationSale.generateUniqueBizNumber();
    req.body.bizNumber = bizNumber;

    const startDayOperationSale = new DailyOperationSale(req.body);
    const incrementalOperationSale = new IncrementalOperationSale(req.body);

    try {
      const toIncrementalOperationSale = await incrementalOperationSale.save();
      const toDailyOperationSale = await startDayOperationSale.save();
      res.send({ toIncrementalOperationSale, toDailyOperationSale });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};
