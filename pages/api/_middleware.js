import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export default function middleware(req) {
  const { cookies } = req;
  const jwt = cookies.chatjwt;
  const url = req.nextUrl.clone();
  // const splitUrl = url.pathname.split("/");

  // if (url.includes("signin") || url.includes("signup")) {
  //   if (jwt && verify(jwt, secret)) {
  //     return NextResponse.json({ message: "already logged in" });
  //   }
  // }

  // if (url.includes("socket")) {
  //   if (!jwt || !verify(jwt, secret)) {
  //     return NextResponse.json({ message: "unathenticated" });
  //   }
  // }
  return NextResponse.next();
}
