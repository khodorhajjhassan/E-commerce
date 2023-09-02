import mongoose from "mongoose";

const visitedUserSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true },
  deviceType: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  visitedAt: { type: Date, default: Date.now },
});
export default mongoose.model("VisitedUser", visitedUserSchema);
