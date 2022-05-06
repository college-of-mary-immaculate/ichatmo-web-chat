import { NextResponse } from "next/server";
const jwt = require("@tsndr/cloudflare-worker-jwt");

export default async function middleware(req) {
  const { cookies } = req;
  const token = cookies.chatjwt;
  const url = req.page.name;

  if (
    url == "/api/chats/[room]" ||
    url == "/api/users/[...slug]" ||
    url == "/api/rooms/[...slug]" ||
    url == "/api/socket"
  ) {
    if (token) {
      if (await jwt.verify(token, process.env.JWT_SECRET)) {
        return NextResponse.next();
      }
    } else {
      return new Response(
        JSON.stringify({ authenticated: false, message: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  return NextResponse.next();
}
