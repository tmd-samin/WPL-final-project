import { guard , businessGuard } from "../../../guards.js";
import { getLoggedUserId } from "../../../config/config.js";
import { User } from "../../users/models/user.model.js";
import {
  DailyOperationSale,
  IncrementalOperationSale,
} from "../schemasOperations&Sales/operationSale.model.js";


export default (app) => {
      app.get("/api/operationTeamSale", businessGuard, async (req, res) => {
        try {
          const { userId } = getLoggedUserId(req, res);

          if (!userId) {
            return res.status(403).json({ message: "User not authorized" });
          }

          const user = await User.findById(userId);

          if (user.teamName && user.IsBusiness) {
            const dailyOperationTeamSale = await DailyOperationSale.find({
              teamName: user.teamName,
            });

            if (
              !dailyOperationTeamSale ||
              dailyOperationTeamSale.length === 0
            ) {
              return res.json({
                message: `No team sales found${user.teamName}`,
              });
            }
            res.send(dailyOperationTeamSale);
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

        app.get(
          "/api/dailyOperatingAverageSaleTeam",
          guard,
          async (req, res) => {
            try {
              const user = getLoggedUserId(req, res);

              if (!user || !user.IsBusiness) {
                return res.status(403).json({ message: "User not authorized" });
              }

              let dailyOperations = await DailyOperationSale.find({
                teamName: user.teamName,
              });

              if (!dailyOperations || dailyOperations.length === 0) {
                return res.json({ message: "" });
              }

              dailyOperations = dailyOperations.map((operation) => ({
                ...operation._doc,
                date: new Date(operation.createTime).toLocaleDateString(
                  "en-US"
                ),
              }));

              const operationsByDate = dailyOperations.reduce(
                (groups, operation) => {
                  const date = operation.date;
                  if (!groups[date]) {
                    groups[date] = [];
                  }
                  groups[date].push(operation);
                  return groups;
                },
                {}
              );

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
              res
                .status(500)
                .json({ message: "Server error", error: error.message });
            }
          }
        );
}