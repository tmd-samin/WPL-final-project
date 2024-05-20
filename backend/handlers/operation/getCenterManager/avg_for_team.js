import { adminGuard } from "../../../guards.js";
import {
  IncrementalOperation,
  DailyOperation,
} from "../schemasOperations&Sales/operations.model.js";
import { getLoggedUserId } from "../../../config/config.js";
import { User } from "../../users/models/user.model.js";
export default (app) => {
app.get(
  "/api/incrementalOperationByCenterManagerAvgTeam",
  adminGuard,
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
              teamName: "$teamName",
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
}