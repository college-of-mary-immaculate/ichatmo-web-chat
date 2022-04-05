import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("socket is running");
  } else {
    console.log("socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("startup", (id) => {
        socket.join(id);
      });

      socket.on("join-chat", (roomId) => {
        console.log("joined", roomId);
        socket.join(roomId);
      });

      socket.on("message", (message) => {
        socket.to(message.roomId).emit("message-receive", message);
      });
    });
  }

  res.end();
}
