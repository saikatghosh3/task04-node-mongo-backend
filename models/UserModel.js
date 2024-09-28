import mongoose from "mongoose";
import {
  userStatus,
  UNBLOCKED,
  userSource,
  SOURCE_EMAIL,
} from "../config/user.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    status: {
      type: String,
      enum: userStatus,
      default: UNBLOCKED,
      required: true,
    },
    source: {
      type: String,
      enum: userSource,
      default: SOURCE_EMAIL,
      required: true,
    },
    lastLogin: { type: Date, default: Date.now },
    registrationDate: { type: Date, required: true, default: Date.now },
  },
  { collection: "users" }
);

const UserModel = mongoose.model("UserSchema", userSchema);

export default UserModel;
