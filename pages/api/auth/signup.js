import { addUser } from "../../../lib/user-queries";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { hash } from "bcrypt";

export default async function signup(req, res) {
  const { username, email, firstname, lastname, password } = req.body;
  const encryptedPass = await hash(password, 10);
  let result = await addUser(
    username,
    firstname,
    lastname,
    email,
    encryptedPass
  );

  if (result.success) {
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
  res.status(200).json({ ...result });
}
