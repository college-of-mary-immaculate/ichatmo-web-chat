import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    roomName: { type: String, required: true },
    isGroup: { type: Boolean, default: false, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    groupAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
