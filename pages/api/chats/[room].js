import { getChats } from "../../../lib/chat-queries";

export default async function handler(req, res) {
  const { room } = req.query;

  const chats = await getChats(room);

  res.status(200).json({ chats });
}
