import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export default function middleware(req) {
  const { cookies } = req;
  const jwt = cookies.chatjwt;
  const url = req.nextUrl.clone();
  const splitUrl = url.pathname.split("/");

  if (splitUrl[1] == "signin" || splitUrl[1] == "signup") {
    if (jwt && verify(jwt, secret)) {
      url.pathname = "/messages";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (splitUrl[1] == "messages") {
    if (!jwt || !verify(jwt, secret)) {
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}
