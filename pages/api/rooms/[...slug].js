import {
  createPrivate,
  createGroup,
  getRooms,
  getRoom,
  searchRooms,
  deleteGroup,
} from "../../../lib/room-queries";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  const { slug } = req.query;
  let result = null;
  if (req.method == "POST") {
    const [type] = slug;
    if (type == "group") {
      const { name, image, members, admin } = req.body;
      result = await createGroup(name, image, members, admin);
    } else if (type == "private") {
      const { userId, targetId } = req.body;
      result = await createPrivate(userId, targetId);
    } else {
      return res.status(405).json({ message: "method not allowed" });
    }
  } else if (req.method == "DELETE") {
    const [id] = slug;

    result = await deleteGroup(id);
  } else if (req.method == "GET") {
    const { cookies } = req;
    const jwt = cookies.chatjwt;
    const { userId } = verify(jwt, process.env.JWT_SECRET);
    if (slug[0] == "search") {
      const [, type, query] = slug;
      result = await searchRooms(type, query, userId);
    } else {
      const [type] = slug;
      if (type == "all" || type == "private" || type == "group") {
        result = await getRooms(userId, type);
      } else if (type == "single") {
        const [, id] = slug;
        result = await getRoom(id);
      } else {
        return res.status(404).json({ message: "not found" });
      }
    }
  }

  res.status(200).json(result);
}
