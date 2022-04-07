import { Server } from "socket.io";
import { insertChat } from "../../lib/chat-queries";

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

      socket.on("join-chat", (rooms) => {
        if (rooms.oldRoom) {
          socket.leave(rooms.oldRoom._id);
        }
        // console.log("joined", rooms.newRoom);
        socket.join(rooms.newRoom._id);
      });

      socket.on("update-convos", (user) => {
        console.log("called");
        // socket.to(user.id).emit("update-list", false);
      });

      socket.on("message", async (message) => {
        const chat = await insertChat(
          message.sender.id,
          message.room._id,
          message.body
        );

        // message.room.members.forEach((member) => {
        //   if (message.sender.id != member._id) {
        //     console.log("receiver", member._id);
        //     socket.to(member._id).emit("message-receive", chat);
        //   }
        // });

        if (message.room.members[0]._id == message.room.members[1]._id) {
          console.log(true);
          socket.to(message.room.members[0]._id).emit("update-list", false);
        } else {
          message.room.members.forEach((member) => {
            socket.to(member._id).emit("update-list", false);
            if (message.sender.id != member._id) {
              console.log("receiver", member._id);
              socket.to(member._id).emit("message-receive", chat);
            }
          });
        }
      });
    });
  }

  res.end();
}
