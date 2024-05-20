import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;
// create a new card schema //
const schema = new Schema({
  nameAgent: String,
  teamName: String,
  sellerFiber: Number,
  sellerTV: Number,
  easyMesh: Number,
  upgradeProgress: Number,
  targets: Number,
  customerCode: String,
  _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
  bizNumber: Number,
  user_id: { type: ObjectId },
  createTime: { type: Date, default: Date.now() },
});

schema.statics.generateUniqueBizNumber = async function () {
  let bizNumber;

  while (true) {
    bizNumber = Math.floor(100000000 + Math.random() * 900000000); //

    const exists = await this.findOne({ bizNumber });

    if (!exists) break;
  }

  return bizNumber;
};

export const IncrementalOperationSale = mongoose.model(
  "incrementalOperationSale",
  schema
);
export const DailyOperationSale = mongoose.model("dailyOperationSale", schema);