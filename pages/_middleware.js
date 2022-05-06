import { NextResponse } from "next/server";
// import { verify } from "jsonwebtoken";
const jwt = require("@tsndr/cloudflare-worker-jwt");

const secret = process.env.JWT_SECRET;

export default async function middleware(req) {
  const { cookies } = req;
  const token = cookies.chatjwt;
  // const url = req.nextUrl.clone();
  // const splitUrl = url.pathname.split("/");
  const url = req.page.name;
  const { origin } = req.nextUrl;

  if (url == "/login" || url == "signup") {
    if (token && (await jwt.verify(token, secret))) {
      return NextResponse.redirect(`${origin}/messages`);
    }
  }

  if (url == "/messages") {
    if (!token || !(await jwt.verify(token, secret))) {
      return NextResponse.redirect(`${origin}/login`);
    }
  }

  return NextResponse.next();
}
