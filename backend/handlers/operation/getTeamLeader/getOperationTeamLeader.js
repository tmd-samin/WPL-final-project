import { guard, businessGuard } from "../../../guards.js";
import {
  IncrementalOperation,
  DailyOperation,
} from "../schemasOperations&Sales/operations.model.js";
import { getLoggedUserId } from "../../../config/config.js";
import { User } from "../../users/models/user.model.js";

export default (app) => {
      app.get("/api/operationTeam", businessGuard, async (req, res) => {
        try {
          const { userId } = getLoggedUserId(req, res);

          if (!userId) {
            return res.status(403).json({ message: "User not authorized" });
          }

          const user = await User.findById(userId);

          if (user.teamName && user.IsBusiness) {
            const dailyOperationTeam = await DailyOperation.find({
              teamName: user.teamName,
            });

            if (!dailyOperationTeam || dailyOperationTeam.length === 0) {
              return res.json({
                message: `We did not find any operation for the team ${user.teamName} Still`,
              });
            }
            res.send(dailyOperationTeam);
          } else {
            res.status(403).json({
              message:
                "User is not a business user or does not belong to a team",
            });
          }
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .json({ message: "Server error", error: error.message });
        }
      });

        app.get("/api/dailyOperatingAverageByTeam", guard, async (req, res) => {
          try {
            const { userId } = getLoggedUserId(req, res);

            if (!userId) {
              return res.status(403).json({ message: "User not authorized" });
            }
            const user = await User.findById(userId);

            if (user.teamName && user.IsBusiness) {
              let dailyOperations = await DailyOperation.find({
                teamName: user.teamName,
              });

              if (!dailyOperations || dailyOperations.length === 0) {
                return res.json({
                  message: "No daily operations found for this user",
                });
              }

              dailyOperations = dailyOperations.map((operation) => ({
                ...operation._doc,
                day: new Date(operation.createTime).toLocaleDateString("en-US"),
              }));

              const operationsByTeamAndDay = dailyOperations.reduce(
                (groups, operation) => {
                  const teamName = operation.teamName;
                  const day = operation.day;
                  const key = `${teamName}-${day}`;
                  if (!groups[key]) {
                    groups[key] = [];
                  }
                  groups[key].push(operation);
                  return groups;
                },
                {}
              );

              const averagesByTeamAndDay = {};
              for (const key in operationsByTeamAndDay) {
                const operations = operationsByTeamAndDay[key];
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
                // ...
                averagesByTeamAndDay[key] = {
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
                  // ...
                };
              }

              res.send(averagesByTeamAndDay);
            }
          } catch (error) {
            console.log(error);
            res
              .status(500)
              .json({ message: "Server error", error: error.message });
          }
        });

            app.get(
              "/api/incrementalOperationPerAgent",
              guard,
              async (req, res) => {
                try {
                  const { userId } = getLoggedUserId(req, res);

                  if (!userId) {
                    return res
                      .status(403)
                      .json({ message: "User not authorized" });
                  }

                  const user = await User.findById(userId);

                  const incrementalOperations = await IncrementalOperation.find(
                    {
                      teamName: user.teamName,
                    }
                  );

                  if (
                    !incrementalOperations ||
                    incrementalOperations.length === 0
                  ) {
                    return res.json({
                      message: "No cumulative operation found for this month",
                    });
                  }
                  res.send(incrementalOperations);
                } catch (error) {
                  console.log(error);
                  res
                    .status(500)
                    .json({ message: "Server error", error: error.message });
                }
              }
            );

        app.get(
          "/api/incrementalOperationTeamAvg",
          businessGuard,
          async (req, res) => {

            try {
              const { userId } = getLoggedUserId(req, res);

              if (!userId) {
                return res.status(403).json({ message: "User not authorized" });
              }

              const user = await User.findById(userId);

              const incrementalOperations =
                await IncrementalOperation.aggregate([
                  {
                    $match: {
                      teamName: user.teamName,
                    },
                  },
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
                        },
                      },
                      simurFiber: {
                        $convert: {
                          input: {
                            $substr: [
                              "$simurFiber",
                              0,
                              { $subtract: [{ $strLenCP: "$simurFiber" }, 1] },
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
                        _id: "$teamName",
                        month: { $month: "$createTime" },
                        year: { $year: "$createTime" },
                      },
                      createTime: { $first: "$createTime" },
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

              if (
                !incrementalOperations ||
                incrementalOperations.length === 0
              ) {
                return res.json({
                  message: "No cumulative operation found for this month",
                });
              }

              res.send(incrementalOperations);
            } catch (error) {
              console.log(error);
              res
                .status(500)
                .json({ message: "Server error", error: error.message });
            }
          }
        );

          app.get("/api/incrementalOperationTeam", guard, async (req, res) => {
            try {
              const { userId } = getLoggedUserId(req, res);

              if (!userId) {
                return res.status(403).json({ message: "User not authorized" });
              }

              const user = await User.findById(userId);

              const incrementalOperations =
                await IncrementalOperation.aggregate([
                  {
                    $match: {
                      teamName: user.teamName,
                    },
                  },
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
                              { $subtract: [{ $strLenCP: "$simurFiber" }, 1] },
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
                        year: { $year: "$createTime" },
                        month: { $month: "$createTime" },
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

              if (
                !incrementalOperations ||
                incrementalOperations.length === 0
              ) {
                return res.json({
                  message: "No cumulative operation found for this month",
                });
              }

              res.send(incrementalOperations);
            } catch (error) {
              console.log(error);
              res
                .status(500)
                .json({ message: "Server error", error: error.message });
            }
          });

              app.get("/api/incrementalOperatingAveragePerAgent", guard, async (req, res) => {
      try {
        const { userId } = getLoggedUserId(req, res);

        if (!userId) {
          return res.status(403).json({ message: "User not authorized" });
        }
        const user = await User.findById(userId);

        let incrementalOperations = await IncrementalOperation.find({
          teamName: user.teamName,
        });

        if (!incrementalOperations || incrementalOperations.length === 0) {
          return res.json({ message: "There is no cumulative average for this month yet" });
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

        res.send(averagesByMonth);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
}