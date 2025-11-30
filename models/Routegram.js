import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const RoutegramSchema = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId, //tipo especial para ids de mongoose
      ref: "User", //referencia al modelo User
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["LineString"],
        required: true,
      },
      coordinates: {
        type: [[Number]],
        required: true,
      },
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

RoutegramSchema.index({ location: "2dsphere" });

export default model("Routegram", RoutegramSchema);
