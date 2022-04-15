import { serialize } from "cookie";

export default async function signOut(req, res) {
  //   const { cookies } = req;
  //   const jwt = cookies.chatjwt;
  const serialized = serialize("chatjwt", null, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", serialized);
  res.end();
}
