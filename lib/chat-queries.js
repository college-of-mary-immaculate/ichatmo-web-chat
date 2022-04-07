import dbConnect from "./database";
import Chat from "./models/chat-model";
import Room from "./models/room-model";

export async function insertChat(senderId, roomId, body) {
  await dbConnect();
  let newChat = null;

  try {
    newChat = await new Chat({
      sender: senderId,
      room: roomId,
      body: body,
    }).populate("sender", "-password");
    await newChat.save();

    await Room.findByIdAndUpdate(roomId, { latestChat: newChat._id }).exec();
  } catch (err) {
    console.log(err);
  }

  return newChat;
}

export async function getChats(roomId) {
  let chats = [];

  try {
    chats = Chat.find({ room: roomId })
      .populate("sender", "-password")
      .sort({ createdAt: 1 })
      .exec();
  } catch (err) {
    console.log(err);
  }

  return chats;
}
