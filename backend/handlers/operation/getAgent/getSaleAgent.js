import { guard } from "../../../guards.js";
import { getLoggedUserId } from "../../../config/config.js";
import { User } from "../../users/models/user.model.js";
import {
  DailyOperationSale,
  IncrementalOperationSale,
} from "../schemasOperations&Sales/operationSale.model.js";

export default (app) => {
  app.get("/api/operationSale", guard, async (req, res) => {
    try {
      const { userId } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }
      const currentSale = await DailyOperationSale.find({
        user_id: userId,
      });

      if (!currentSale || currentSale.length === 0) {
        return res.json({ message: "No sales found for today!" });
      }
      res.send(currentSale);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  app.get("/api/dailyOperatingAverageSale", guard, async (req, res) => {
    try {
      const { userId } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }

      let dailyOperations = await DailyOperationSale.find({
        user_id: userId,
      });

      if (!dailyOperations || dailyOperations.length === 0) {
        return res.json({ message: "" });
      }

      dailyOperations = dailyOperations.map((operation) => ({
        ...operation._doc,
        date: new Date(operation.createTime).toLocaleDateString("en-US"),
      }));

      const operationsByDate = dailyOperations.reduce((groups, operation) => {
        const date = operation.date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(operation);
        return groups;
      }, {});

      const averagesByDate = {};
      for (const date in operationsByDate) {
        const operations = operationsByDate[date];
        let totalSellerFiber = 0;
        let totalSellerTV = 0;
        let totalEasyMesh = 0;
        let totalUpgradeProgress = 0;

        operations.forEach((operation) => {
          totalSellerFiber += operation.sellerFiber;
          totalSellerTV += operation.sellerTV;
          totalEasyMesh += operation.easyMesh;
          totalUpgradeProgress += operation.upgradeProgress;
        });

        averagesByDate[date] = {
          totalSellerFiber: totalSellerFiber,
          totalSellerTV: totalSellerTV,
          totalEasyMesh: totalEasyMesh,
          totalUpgradeProgress: totalUpgradeProgress,
        };
      }

      res.send(averagesByDate);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  app.get("/api/incrementalOperationSale", guard, async (req, res) => {
    try {
      const { userId } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }

      const user = await User.findById(userId);

      const incrementalOperationsSale = await IncrementalOperationSale.find({
        user_id: userId,
      });

      if (
        !incrementalOperationsSale ||
        incrementalOperationsSale.length === 0
      ) {
        return res.json({ message: "There are no sales for the cumulative month at this time." });
      }
      res.send(incrementalOperationsSale);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  app.get("/api/incrementalOperatingAverageSale", guard, async (req, res) => {
    try {
      const { userId } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }

      let incrementalOperations = await IncrementalOperationSale.find({
        user_id: userId,
      });

      if (!incrementalOperations || incrementalOperations.length === 0) {
        return res.json({ message: "" });
      }

      incrementalOperations = incrementalOperations.map((operation) => ({
        ...operation._doc,
        monthYear: new Date(operation.createTime).toLocaleDateString("en-US", {
          month: "2-digit",
          year: "numeric",
        }),
      }));

      const operationsByMonth = incrementalOperations.reduce(
        (groups, operation) => {
          const monthYear = operation.monthYear;
          if (!groups[monthYear]) {
            groups[monthYear] = [];
          }
          groups[monthYear].push(operation);
          return groups;
        },
        {}
      );

      const averagesByMonth = {};
      for (const monthYear in operationsByMonth) {
        const operations = operationsByMonth[monthYear];
        let totalSellerFiber = 0;
        let totalSellerTV = 0;
        let totalEasyMesh = 0;
        let totalUpgradeProgress = 0;

        operations.forEach((operation) => {
          totalSellerFiber += operation.sellerFiber;
          totalSellerTV += operation.sellerTV;
          totalEasyMesh += operation.easyMesh;
          totalUpgradeProgress += operation.upgradeProgress;
        });

        averagesByMonth[monthYear] = {
          totalSellerFiber: totalSellerFiber,
          totalSellerTV: totalSellerTV,
          totalEasyMesh: totalEasyMesh,
          totalUpgradeProgress: totalUpgradeProgress,
        };
      }

      res.send(averagesByMonth);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};
