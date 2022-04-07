import { createPrivateRoom } from "../../../lib/room-queries";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "method not allowed" });
  } else {
    const { userId, targetId } = req.body;
    const result = await createPrivateRoom(userId, targetId);
    res.status(200).json(result);
  }
}
