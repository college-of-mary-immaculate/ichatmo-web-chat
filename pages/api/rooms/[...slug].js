import {
  createPrivate,
  createGroup,
  getRooms,
  getRoom,
  deleteGroup,
} from "../../../lib/room-queries";

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
    const [type, id] = slug;
    console.log(type, id);
    if (type == "all" || type == "private" || type == "group") {
      result = await getRooms(id, type);
    } else if (type == "single") {
      result = await getRoom(id);
    } else {
      return res.status(404).json({ message: "not found" });
    }
  }

  res.status(200).json(result);
}
