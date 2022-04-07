import dbConnect from "./database";
import Room from "./models/room-model";
import User from "./models/user-model";

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
        // latestMessage: undefined,
      }).populate("members", "-password");

      await newRoom.save();

      response.room = newRoom;
    } catch (err) {
      console.log(err);
    }
  }

  return response;
}

export async function createGroup(name, image, members, admin) {
  await dbConnect();
  let response = {
    room: null,
  };

  try {
    let imageUrl = "";
    await cloudinary.uploader
      .upload(image, {
        folder: `ichatmo/users/${username}`,
        quality: "auto:low",
      })
      .then((result) => {
        imageUrl = result.url;
      })
      .catch((err) => {
        console.log("Error in cloudinary", err);
      });

    const newRoom = await new Room({
      isGroup: "true",
      groupName: name,
      members: [...members],
      groupImage: imageUrl,
      groupAdmin: admin,
    }).populate("members", "-password");

    await newRoom.save();

    response.room = newRoom;
  } catch (err) {
    console.log(err);
  }
}

export async function getRooms(userId) {
  let response = {
    rooms: [],
  };

  try {
    response.rooms = await Room.find({
      members: { $elemMatch: { $eq: userId } },
    })
      .populate("members", "-password")
      .populate("latestChat", "-room")
      .sort({ updatedAt: -1 })
      .exec();

    response.rooms = await User.populate(response.rooms, {
      path: "latestChat.sender",
      select: "fullname firstname lastname image",
    });

    // console.log(response.rooms);
  } catch (err) {
    console.log(err);
  }

  return response;
}
