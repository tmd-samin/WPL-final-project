import { adminGuard } from "../../../guards.js";
import { getLoggedUserId } from "../../../config/config.js";
import {
  IncrementalOperationSale,
} from "../schemasOperations&Sales/operationSale.model.js";

export default (app) => {
  app.get(
    "/api/incrementalOperationSaleCenterManger",
    adminGuard,
    async (req, res) => {
      try {
        const { userId } = getLoggedUserId(req, res);

        if (!userId) {
          return res.status(403).json({ message: "User not authorized" });
        }

        const incrementalOperationsSale = await IncrementalOperationSale.find(
          {}
        );

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
    }
  );
  app.get(
    "/api/incrementalOperatingAverageSaleCenterManger",
    adminGuard,
    async (req, res) => {
      try {
        const { userId } = getLoggedUserId(req, res);

        if (!userId) {
          return res.status(403).json({ message: "User not authorized" });
        }

        let incrementalOperations = await IncrementalOperationSale.find({});

        if (!incrementalOperations || incrementalOperations.length === 0) {
          return res.json({ message: "" });
        }

        incrementalOperations = incrementalOperations.map((operation) => ({
          ...operation._doc,
          monthYear: new Date(operation.createTime).toLocaleDateString(
            "en-US",
            {
              month: "2-digit",
              year: "numeric",
            }
          ),
          nameAgent: operation.nameAgent,
          teamName: operation.teamName,
        }));

        const operationsByMonthAndAgent = incrementalOperations.reduce(
          (groups, operation) => {
            const monthYear = operation.monthYear;
            const agentName = operation.nameAgent;

            if (!groups[monthYear]) {
              groups[monthYear] = {};
            }

            if (!groups[monthYear][agentName]) {
              groups[monthYear][agentName] = [];
            }

            groups[monthYear][agentName].push(operation);
            return groups;
          },
          {}
        );

        const averagesByMonthAndAgent = {};
        for (const monthYear in operationsByMonthAndAgent) {
          averagesByMonthAndAgent[monthYear] = [];

          for (const agentName in operationsByMonthAndAgent[monthYear]) {
            const operations = operationsByMonthAndAgent[monthYear][agentName];
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

            averagesByMonthAndAgent[monthYear].push({
              nameAgent: agentName,
              totalSellerFiber: totalSellerFiber,
              totalSellerTV: totalSellerTV,
              totalEasyMesh: totalEasyMesh,
              totalUpgradeProgress: totalUpgradeProgress,
              teamName: operations[0].teamName,
            });
          }
        }

        res.send(averagesByMonthAndAgent);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  );
};
