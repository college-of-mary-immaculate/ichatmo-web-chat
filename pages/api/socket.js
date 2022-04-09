import { Server } from "socket.io";
import { insertChat } from "../../lib/chat-queries";
import { getRoom } from "../../lib/room-queries";

const users = {};

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("socket is running");
  } else {
    console.log("socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("startup", (id) => {
        users[socket.id] = id;
        io.sockets.emit("user-connect", id);
        socket.join(id);
        console.log(`${id} connected`);
      });

      socket.on("disconnect", () => {
        if (users[socket.id]) {
          io.sockets.emit("user-disconnect", users[socket.id]);
          console.log(`${users[socket.id]} disconnected`);
          delete users[socket.id];
        }
      });

      socket.on("room-online-check", (userIds) => {
        io.in(userIds.client).emit("room-is-online", {
          isOnline: Object.values(users).some((id) =>
            userIds.toCheckIds.includes(id)
          ),
          toCheckIds: userIds.toCheckIds,
          // user: userIds.toCheckIds,
        });
      });

      socket.on("user-online-check", (userIds) => {
        io.in(userIds.client).emit("user-is-online", {
          isOnline: Object.values(users).includes(userIds.toCheckId),
          toCheckId: userIds.toCheckId,
        });
      });

      socket.on("join-chat", (rooms) => {
        if (rooms.oldRoom) {
          socket.leave(rooms.oldRoom._id);
        }
        // console.log("joined", rooms.newRoom);
        socket.join(rooms.newRoom._id);
      });

      socket.on("message", async (message) => {
        const chat = await insertChat(
          message.sender.id,
          message.room._id,
          message.body
        );
        const updatedRoom = await getRoom(message.room._id);
        if (message.room.members[0]._id == message.room.members[1]._id) {
          io.in(message.room.members[0]._id).emit("update-list", updatedRoom);
        } else {
          message.room.members.forEach((member) => {
            io.in(member._id).emit("update-list", updatedRoom);
            if (message.sender.id != member._id) {
              socket.to(member._id).emit("message-receive", chat);
            }
          });
        }
      });
    });
  }

  res.end();
}
