import { guard, adminGuard, businessGuard } from "../../../guards.js";
import {
  IncrementalOperation,
  DailyOperation,
} from "../schemasOperations&Sales/operations.model.js";
import { getLoggedUserId } from "../../../config/config.js";
import { User } from "../../users/models/user.model.js";

export default (app) => {
  app.get("/api/getOperationCenterManager", adminGuard, async (req, res) => {
    const { userId } = getLoggedUserId(req, res);

    if (!userId) {
      return res.status(403).json({ message: "User not authorized" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const toDailyOperation = await DailyOperation.find({});

      if (!toDailyOperation) {
        return res.status(404).json({ message: "Operation not found" });
      }

      res.send(toDailyOperation);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  app.get("/api/dailyOperatingAverageByCenter", guard, async (req, res) => {
    try {
      const { userId } = getLoggedUserId(req, res);

      if (!userId) {
        return res.status(403).json({ message: "User not authorized" });
      }
      const user = await User.findById(userId);

      if (user.isAdmin) {
        let dailyOperations = await DailyOperation.find({});

        if (!dailyOperations || dailyOperations.length === 0) {
          return res.json({
            message: "No daily operations found for this user",
          });
        }

        dailyOperations = dailyOperations.map((operation) => ({
          ...operation._doc,
          day: new Date(operation.createTime).toLocaleDateString("en-US"),
        }));

        const operationsByDay = dailyOperations.reduce((groups, operation) => {
          const day = operation.day;
          if (!groups[day]) {
            groups[day] = [];
          }
          groups[day].push(operation);
          return groups;
        }, {});

        const averagesByDay = {};
        for (const day in operationsByDay) {
          const operations = operationsByDay[day];
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

          averagesByDay[day] = {
            totalNumberCalls: totalNumberCalls,
            totalTvDisconnection: totalTvDisconnection,
            totalFiberDisconnection: totalFiberDisconnection,
            totalSellerFiber: totalSellerFiber,
            totalSellerTV: totalSellerTV,
            totalEasyMesh: totalEasyMesh,
            totalUpgradeProgress: totalUpgradeProgress,
            totalProductivity: (totalProductivity / operations.length).toFixed(
              2
            ),
            totalSimurFiber:
              (totalSimurFiber / operations.length).toFixed(2) + "%",
            totalSimurTV: (totalSimurTV / operations.length).toFixed(2) + "%",
            totalSatisfaction:
              (totalSatisfaction / operations.length).toFixed(2) + "%",
          };
        }

        res.send(averagesByDay);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  app.get(
    "/api/incrementalOperationByCenterManager",
    guard,
    async (req, res) => {
      try {
        const { userId } = getLoggedUserId(req, res);

        if (!userId) {
          return res.status(403).json({ message: "User not authorized" });
        }

        const user = await User.findById(userId);

        const incrementalOperations = await IncrementalOperation.aggregate([
          {
            $addFields: {
              productivity: {
                $convert: {
                  input: {
                    $substr: [
                      "$productivity",
                      0,
                      {
                        $subtract: [{ $strLenCP: "$productivity" }, 1],
                      },
                    ],
                  },
                  to: "double",
                  onError: 0.0,
                },
              },
              simurFiber: {
                $convert: {
                  input: {
                    $substr: [
                      "$simurFiber",
                      0,
                      {
                        $subtract: [{ $strLenCP: "$simurFiber" }, 1],
                      },
                    ],
                  },
                  to: "double",
                },
              },
              satisfaction: {
                $convert: {
                  input: {
                    $substr: [
                      "$satisfaction",
                      0,
                      {
                        $subtract: [{ $strLenCP: "$satisfaction" }, 1],
                      },
                    ],
                  },
                  to: "double",
                },
              },
              simurTV: {
                $convert: {
                  input: {
                    $substr: [
                      "$simurTV",
                      0,
                      { $subtract: [{ $strLenCP: "$simurTV" }, 1] },
                    ],
                  },
                  to: "double",
                },
              },
            },
          },
          {
            $group: {
              _id: {
                user_id: "$user_id",
                month: { $month: "$createTime" },
                year: { $year: "$createTime" },
              },
              nameAgent: { $first: "$nameAgent" },
              createTime: { $first: "$createTime" },
              teamName: { $first: "$teamName" },
              numberCalls: { $sum: "$numberCalls" },
              tvDisconnection: { $sum: "$tvDisconnection" },
              fiberDisconnection: { $sum: "$fiberDisconnection" },
              sellerFiber: { $sum: "$sellerFiber" },
              sellerTV: { $sum: "$sellerTV" },
              easyMesh: { $sum: "$easyMesh" },
              productivity: { $avg: "$productivity" },
              satisfaction: { $avg: "$satisfaction" },
              upgradeProgress: { $sum: "$upgradeProgress" },
              targets: { $sum: "$targets" },
              simurFiber: { $avg: "$simurFiber" },
              simurTV: { $avg: "$simurTV" },
            },
          },
        ]);

        if (!incrementalOperations || incrementalOperations.length === 0) {
          return res.json({
            message: "No cumulative operation found for this month",
          });
        }

        res.send(incrementalOperations);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  );

  app.get(
    "/api/incrementalOperationByCenterManagerAvg",
    guard,
    async (req, res) => {
      try {
        const { userId } = getLoggedUserId(req, res);

        if (!userId) {
          return res.status(403).json({ message: "User not authorized" });
        }

        const incrementalOperations = await IncrementalOperation.aggregate([
          {
            $addFields: {
              productivity: {
                $convert: {
                  input: {
                    $substr: [
                      "$productivity",
                      0,
                      {
                        $subtract: [{ $strLenCP: "$productivity" }, 1],
                      },
                    ],
                  },
                  to: "double",
                  onError: 0.0,
                },
              },
              simurFiber: {
                $convert: {
                  input: {
                    $substr: [
                      "$simurFiber",
                      0,
                      {
                        $subtract: [{ $strLenCP: "$simurFiber" }, 1],
                      },
                    ],
                  },
                  to: "double",
                },
              },
              satisfaction: {
                $convert: {
                  input: {
                    $substr: [
                      "$satisfaction",
                      0,
                      {
                        $subtract: [{ $strLenCP: "$satisfaction" }, 1],
                      },
                    ],
                  },
                  to: "double",
                },
              },
              simurTV: {
                $convert: {
                  input: {
                    $substr: [
                      "$simurTV",
                      0,
                      { $subtract: [{ $strLenCP: "$simurTV" }, 1] },
                    ],
                  },
                  to: "double",
                },
              },
            },
          },
          {
            $group: {
              _id: {
                user_id: "$user_id",
                month: { $month: "$createTime" },
                year: { $year: "$createTime" },
              },
              nameAgent: { $first: "$nameAgent" },
              createTime: { $first: "$createTime" },
              teamName: { $first: "$teamName" },
              numberCalls: { $sum: "$numberCalls" },
              tvDisconnection: { $sum: "$tvDisconnection" },
              fiberDisconnection: { $sum: "$fiberDisconnection" },
              sellerFiber: { $sum: "$sellerFiber" },
              sellerTV: { $sum: "$sellerTV" },
              easyMesh: { $sum: "$easyMesh" },
              productivity: { $avg: "$productivity" },
              satisfaction: { $avg: "$satisfaction" },
              upgradeProgress: { $sum: "$upgradeProgress" },
              targets: { $sum: "$targets" },
              simurFiber: { $avg: "$simurFiber" },
              simurTV: { $avg: "$simurTV" },
            },
          },
        ]);

        if (!incrementalOperations || incrementalOperations.length === 0) {
          return res.json({
            message: "No cumulative operation found for this month",
          });
        }

        res.send(incrementalOperations);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    }
  );
  app.get(
    "/api/incrementalOperationPerAgentCenterManager",
    guard,
    async (req, res) => {
      try {
        const { userId } = getLoggedUserId(req, res);

        if (!userId) {
          return res.status(403).json({ message: "User not authorized" });
        }

        const user = await User.findById(userId);

        const incrementalOperations = await IncrementalOperation.find({});

        if (!incrementalOperations || incrementalOperations.length === 0) {
          return res.json({
            message: "No cumulative operation found for this month",
          });
        }
        res.send(incrementalOperations);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Server error",
          error: error.message,
        });
      }
    }
  );
};
