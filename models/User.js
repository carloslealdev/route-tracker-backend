import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    identityCard: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Worker", "Admin"],
      default: "Worker",
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
