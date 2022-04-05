import { searchUser } from "../../../lib/user-queries";

export default async function handler(req, res) {
  const { user } = req.query;

  const data = await searchUser(user);

  res.status(200).json(data);
}
