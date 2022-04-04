import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("socket is running");
  } else {
    console.log("socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("message", (msg) => {
        socket.broadcast.emit("message-receive", {
          sender: "other",
          message: msg,
        });
        // console.log(msg);
      });

      socket.on("startup", (id) => {
        socket.join(id);
      });
    });
  }

  res.end();
}
