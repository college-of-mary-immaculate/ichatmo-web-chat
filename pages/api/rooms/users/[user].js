import { getRooms } from "../../../../lib/room-queries";

export default async function handler(req, res) {
  const { user } = req.query;
  const data = await getRooms(user);
  res.status(200).json(data);
}
