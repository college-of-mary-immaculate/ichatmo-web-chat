import { getRooms } from "../../../lib/room-queries";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  const { cookies } = req;
  const jwt = cookies.chatjwt;
  const { userId } = verify(jwt, process.env.JWT_SECRET);
  const data = await getRooms(userId);
  console.log(data);
  res.end();
}
