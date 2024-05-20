import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;
// create a new user schema //
const schema = new Schema({
  name: {
    first: { type: String },
    middle: { type: String },
    last: { type: String },
    _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
  },
  IsBusiness: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  serviceDepartment: {
    type: Boolean,
    default: false,
  },
  conservationDepartment: {
    type: Boolean,
    default: false,
  },
  teamName: {
    type: String,
    enum: ["iron", "impact", "toy"],
  },
  phone: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,

  createTime: { type: Date, default: Date.now() },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date },
});

export const User = mongoose.model("users", schema);
