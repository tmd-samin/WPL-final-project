import mongoose, { Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
// create a new card schema //
const schema = new Schema({
  nameAgent: String,
  numberCalls: Number,
  productivity: String,
  tvDisconnection: Number,
  fiberDisconnection: Number,
  simurFiber: String,
  simurTV: String,
  sellerFiber: Number,
  sellerTV: Number,
  easyMesh: Number,
  upgradeProgress: Number,
  satisfaction: String,
  targets: Number,
  bizNumber: Number,
  teamName: String,
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

export const IncrementalOperation = mongoose.model("incrementalOperations", schema);
export const DailyOperation = mongoose.model("dailyOperation", schema);
