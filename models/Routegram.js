import mongoose from "mongoose";
const { Schema } = mongoose;

const RoutegramSchema = new Schema({
  userId: {
    type: Object,
  },
  location: {},
});
