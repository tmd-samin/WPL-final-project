import { guard } from "../../../guards.js";
import { IncrementalOperation, DailyOperation,} from "../schemasOperations&Sales/operations.model.js";
import { getLoggedUserId } from "../../../config/config.js";
import { User } from "../../users/models/user.model.js";

export default (app) => {

      app.get("/api/operationId", guard, async (req, res) => {
        try {
          const { userId } = getLoggedUserId(req, res);

          if (!userId) {
            return res.status(403).json({ message: "User not authorized" });
          }
          const currentOperation = await DailyOperation.find({
            user_id: userId,
          });

          if (!currentOperation || currentOperation.length === 0) {
            return res.json({
              message: `No day operation found, click "Start data"`,
            });
          }
          res.send(currentOperation);
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .json({ message: "Server error", error: error.message });
        }
      });

        app.get("/api/incrementalOperation", guard, async (req, res) => {
          try {
            const { userId } = getLoggedUserId(req, res);

            if (!userId) {
              return res.status(403).json({ message: "User not authorized" });
            }

            const user = await User.findById(userId);

            const incrementalOperations = await IncrementalOperation.find({
              user_id: userId,
            });

            if (!incrementalOperations || incrementalOperations.length === 0) {
              return res.json({ message: "No cumulative operation found for this month" });
            }
            res.send(incrementalOperations);
          } catch (error) {
            console.log(error);
            res
              .status(500)
              .json({ message: "Server error", error: error.message });
          }
        });
          app.get(
            "/api/incrementalOperatingAverage",
            guard,
            async (req, res) => {
              try {
                const { userId } = getLoggedUserId(req, res);

                if (!userId) {
                  return res
                    .status(403)
                    .json({ message: "User not authorized" });
                }

                let incrementalOperations = await IncrementalOperation.find({
                  user_id: userId,
                });

                if (
                  !incrementalOperations ||
                  incrementalOperations.length === 0
                ) {
                  return res.json({
                    message: "There is no cumulative average for this month yet",
                  });
                }

                incrementalOperations = incrementalOperations.map(
                  (operation) => ({
                    ...operation._doc,
                    monthYear: new Date(
                      operation.createTime
                    ).toLocaleDateString("en-US", {
                      month: "2-digit",
                      year: "numeric",
                    }),
                  })
                );

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
                  let totalNumberCalls = 0;
                  let totalTvDisconnection = 0;
                  let totalFiberDisconnection = 0;
                  let totalSellerFiber = 0;
                  let totalSellerTV = 0;
                  let totalEasyMesh = 0;
                  let totalUpgradeProgress = 0;
                  let totalProductivity = 0;
                  let totalSimurFiber = 0;
                  let totalSimurTV = 0;
                  let totalSatisfaction = 0;

                  operations.forEach((operation) => {
                    totalNumberCalls += operation.numberCalls;
                    totalTvDisconnection += operation.tvDisconnection;
                    totalFiberDisconnection += operation.fiberDisconnection;
                    totalSellerFiber += operation.sellerFiber;
                    totalSellerTV += operation.sellerTV;
                    totalEasyMesh += operation.easyMesh;
                    totalUpgradeProgress += operation.upgradeProgress;
                    totalProductivity += parseFloat(operation.productivity);
                    totalSimurFiber += parseFloat(operation.simurFiber);
                    totalSimurTV += parseFloat(operation.simurTV);
                    totalSatisfaction += parseFloat(operation.satisfaction);
                  });

                  averagesByMonth[monthYear] = {
                    totalNumberCalls: totalNumberCalls,
                    totalTvDisconnection: totalTvDisconnection,
                    totalFiberDisconnection: totalFiberDisconnection,
                    totalSellerFiber: totalSellerFiber,
                    totalSellerTV: totalSellerTV,
                    totalEasyMesh: totalEasyMesh,
                    totalUpgradeProgress: totalUpgradeProgress,
                    totalProductivity: (
                      totalProductivity / operations.length
                    ).toFixed(2),
                    totalSimurFiber:
                      (totalSimurFiber / operations.length).toFixed(2) + "%",
                    totalSimurTV:
                      (totalSimurTV / operations.length).toFixed(2) + "%",
                    totalSatisfaction:
                      (totalSatisfaction / operations.length).toFixed(2) + "%",
                  };
                }

                res.send(averagesByMonth);
              } catch (error) {
                console.log(error);
                res
                  .status(500)
                  .json({ message: "Server error", error: error.message });
              }
            }
          );
}