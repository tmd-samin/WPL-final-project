import { guard } from "../../../guards.js";
import {
  IncrementalOperation,
  DailyOperation,
} from "../schemasOperations&Sales/operations.model.js";
import { getLoggedUserId } from "../../../config/config.js";
import {
  DailyOperationSale,
  IncrementalOperationSale,
} from "../schemasOperations&Sales/operationSale.model.js";
import { middlewareSales } from "../../../middleware/middlewareSale.js";
import moment from "moment";

export default (app) => {
      app.put(
        "/api/dailyOperationAgentUpdateForSale/:bizNumber",
        guard,
        async (req, res) => {
          const { userId } = getLoggedUserId(req, res);

          if (!userId) {
            return res.status(403).json({ message: "User not authorized" });
          }

          req.body.user_id = userId;

          const { error } = middlewareSales.validate(req.body);
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }

          try {
            const toIncrementalOperation =
              await IncrementalOperation.findOneAndUpdate(
                { bizNumber: req.params.bizNumber },
                req.body,
                { new: true }
              );

            const toDailyOperation = await DailyOperation.findOneAndUpdate(
              { bizNumber: req.params.bizNumber },
              req.body,
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

      app.put(
        "/api/dailyOperationUpdateSale/:bizNumber",
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
          } else {
            updateData.user_id = userId;
          }

          const { error } = middlewareSales.validate(updateData);
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }

          try {
            const toIncrementalOperationSale =
              await IncrementalOperationSale.findOne({
                bizNumber: req.params.bizNumber,
              });

            const toDailyOperationSale = await DailyOperationSale.findOne({
              bizNumber: req.params.bizNumber,
            });

            if (!toIncrementalOperationSale) {
              return res.status(404).json({ message: "Operation not found" });
            }

            if (
              toIncrementalOperationSale &&
              toIncrementalOperationSale.user_id.toString() !== userId &&
              !IsBusiness
            ) {
              return res
                .status(403)
                .json({
                  message: "User not authorized to update this operation",
                });
            }

            if (
              toDailyOperationSale &&
              toDailyOperationSale.user_id &&
              toDailyOperationSale.user_id.toString() !== userId &&
              !IsBusiness
            ) {
              return res
                .status(403)
                .json({
                  message: "User not authorized to update this operation",
                });
            }

            const updatedIncrementalOperationSale =
              await IncrementalOperationSale.findOneAndUpdate(
                { bizNumber: req.params.bizNumber },
                updateData,
                { new: true }
              );

            let updatedDailyOperationSale;
            if (toDailyOperationSale) {
              updatedDailyOperationSale =
                await DailyOperationSale.findOneAndUpdate(
                  { bizNumber: req.params.bizNumber },
                  updateData,
                  { new: true }
                );
            } else {
              updatedDailyOperationSale = await DailyOperationSale.create(
                updateData
              );
            }

            let updatedIncrementalOperation;
            if (
              updatedIncrementalOperationSale &&
              updatedIncrementalOperationSale.user_id
            ) {
              const createTime = moment(
                updatedDailyOperationSale.createTime
              ).startOf("day");
              const incrementalOperationSales =
                await IncrementalOperationSale.find({
                  user_id: updatedIncrementalOperationSale.user_id,
                  createTime: {
                    $gte: new Date(createTime),
                    $lt: new Date(moment(createTime).add(1, "days")),
                  },
                });
              if (
                incrementalOperationSales &&
                incrementalOperationSales.length > 0
              ) {
                const totalSellerFiber = incrementalOperationSales.reduce(
                  (total, sale) => total + sale.sellerFiber,
                  0
                );
                const totalSellerTV = incrementalOperationSales.reduce(
                  (total, sale) => total + sale.sellerTV,
                  0
                );
                const totalEasyMesh = incrementalOperationSales.reduce(
                  (total, sale) => total + sale.easyMesh,
                  0
                );
                const totalUpgradeProgress = incrementalOperationSales.reduce(
                  (total, sale) => total + sale.upgradeProgress,
                  0
                );
                updatedIncrementalOperation =
                  await IncrementalOperation.findOneAndUpdate(
                    {
                      user_id: updatedIncrementalOperationSale.user_id,
                      createTime: {
                        $gte: new Date(createTime),
                        $lt: new Date(moment(createTime).add(1, "days")),
                      },
                    },
                    {
                      ...updateData,
                      sellerFiber: totalSellerFiber,
                      sellerTV: totalSellerTV,
                      easyMesh: totalEasyMesh,
                      upgradeProgress: totalUpgradeProgress,
                    },
                    { new: true }
                  );
              }
            }

            let updatedDailyOperation;
            if (
              updatedDailyOperationSale &&
              updatedDailyOperationSale.user_id
            ) {
              const createTime = moment(
                updatedDailyOperationSale.createTime
              ).startOf("day");
              const dailyOperationSales = await DailyOperationSale.find({
                user_id: updatedDailyOperationSale.user_id,
                createTime: {
                  $gte: new Date(createTime),
                  $lt: new Date(moment(createTime).add(1, "days")),
                },
              });

              if (dailyOperationSales && dailyOperationSales.length > 0) {
                const totalSellerFiber = dailyOperationSales.reduce(
                  (total, sale) => total + sale.sellerFiber,
                  0
                );
                const totalSellerTV = dailyOperationSales.reduce(
                  (total, sale) => total + sale.sellerTV,
                  0
                );
                const totalEasyMesh = dailyOperationSales.reduce(
                  (total, sale) => total + sale.easyMesh,
                  0
                );
                const totalUpgradeProgress = dailyOperationSales.reduce(
                  (total, sale) => total + sale.upgradeProgress,
                  0
                );
                updatedDailyOperation = await DailyOperation.findOneAndUpdate(
                  {
                    user_id: updatedDailyOperationSale.user_id,
                    createTime: {
                      $gte: new Date(createTime),
                      $lt: new Date(moment(createTime).add(1, "days")),
                    },
                  },
                  {
                    ...updateData,
                    sellerFiber: totalSellerFiber,
                    sellerTV: totalSellerTV,
                    easyMesh: totalEasyMesh,
                    upgradeProgress: totalUpgradeProgress,
                  },
                  { new: true }
                );
              }
            }
            res.send({
              updatedDailyOperationSale,
              updatedIncrementalOperationSale,
              updatedDailyOperation,
              updatedIncrementalOperation,
            });
          } catch (error) {
            res
              .status(500)
              .json({ message: "Server error", error: error.message });
          }
        }
      );
};
