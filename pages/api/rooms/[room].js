import { getRooms } from "../../../lib/room-queries";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { cookies } = req;
    const jwt = cookies.chatjwt;
    const { userId } = verify(jwt, process.env.JWT_SECRET);
    const data = await getRooms(userId);
    res.status(200).json(data);
  } else if (req.method == "POST") {
  }
}
