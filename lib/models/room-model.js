import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false, required: true },
    groupName: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    groupImage: { type: String },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
