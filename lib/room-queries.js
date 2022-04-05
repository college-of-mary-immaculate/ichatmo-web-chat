import dbConnect from "./database";
import Room from "./models/room-model";

export async function createPrivateRoom(userId, targetId) {
  await dbConnect();
  let response = {
    room: null,
  };

  try {
    response.room = await Room.findOne({
      isGroup: false,
      $and: [
        { members: { $elemMatch: { $eq: userId } } },
        { members: { $elemMatch: { $eq: targetId } } },
      ],
    })
      .populate("members", "-password")
      .exec();
  } catch (err) {
    console.log(err);
  }

  if (!response.room) {
    try {
      const newRoom = await new Room({
        isGroup: "false",
        members: [userId, targetId],
      }).populate("members", "-password");
      await newRoom.save();

      response.room = newRoom;
    } catch (err) {
      console.log(err);
    }
  }

  return response;
}

export async function getRooms(userId) {
  let result = {
    rooms: [],
  };

  try {
    const rooms = await Room.find({ members: { $elemMatch: { $eq: userId } } })
      .populate("members", "-password")
      .exec();

    console.log(rooms);
  } catch (err) {
    console.log(err);
  }

  return result;
}
