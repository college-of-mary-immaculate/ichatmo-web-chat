import { checkUser } from "../../../lib/user-queries";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { compare } from "bcrypt";

export default async function signin(req, res) {
  const { user, password } = req.body;
  const response = {
    isCredentials: {
      user: {
        ok: false,
      },
      password: {
        ok: false,
      },
    },
  };
  const result = await checkUser(user);
  let passwordMatch = false;

  if (result.found) {
    response.isCredentials.user.ok = true;
    passwordMatch = await compare(password, result.password);
  }

  if (passwordMatch) {
    if (passwordMatch && result.found) {
      const date = new Date();
      const token = sign({ userId: result.userId }, process.env.JWT_SECRET);
      const serialized = serialize("chatjwt", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: date.setTime(date.getTime() + 14 * 24 * 60 * 60 * 1000),
        path: "/",
      });
      res.setHeader("Set-Cookie", serialized);
    }
    response.isCredentials.password.ok = true;
  }
  res.status(200).json({ ...response });
}
