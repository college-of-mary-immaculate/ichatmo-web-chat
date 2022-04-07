import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    roomName: { type: String },
    isGroup: { type: Boolean, default: false, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    groupImage: { type: String },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
