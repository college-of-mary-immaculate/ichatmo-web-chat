import { searchUser, updateUserInfo } from "../../../lib/user-queries";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  const { slug } = req.query;
  let result = null;

  if (req.method == "GET" && slug[0] == "search") {
    const [, userQuery] = slug;

    result = await searchUser(userQuery);
  } else if (req.method == "POST") {
    const [id] = slug;
    const { cookies, body } = req;
    const jwt = cookies.chatjwt;
    const { userId } = verify(jwt, process.env.JWT_SECRET);
    if (id == userId) {
      result = await updateUserInfo(id, body);
    } else {
      return res.status(401).json({
        message:
          "You are not logged in with the id, unauthorized to change resource",
      });
    }
  } else {
    return res.status(405).json({ message: "method not allowed" });
  }

  res.status(200).json(result);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
