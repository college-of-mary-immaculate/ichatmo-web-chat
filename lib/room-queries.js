import mongoose from "mongoose";
import dbConnect from "./database";
import Room from "./models/room-model";
import User from "./models/user-model";
import Chat from "./models/chat-model";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function createPrivate(userId, targetId) {
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
    let id = new mongoose.Types.ObjectId();

    await cloudinary.uploader
      .upload(image, {
        folder: `ichatmo/rooms/${id}`,
        quality: "auto:low",
      })
      .then((result) => {
        imageUrl = result.url;
      })
      .catch((err) => {
        console.log("Error in cloudinary", err);
      });

    const newRoom = await new Room({
      _id: id,
      isGroup: true,
      groupName: name,
      members: members,
      groupImage: imageUrl,
      groupAdmin: admin,
    }).populate("members", "-password");

    await newRoom.save();

    response.room = newRoom;
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function deleteGroup(id) {
  let response = {
    deleted: false,
  };

  try {
    await Room.findByIdAndDelete(id);
    response.deleted = true;
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function getRoom(roomId) {
  await dbConnect();
  let response = {
    room: null,
  };

  try {
    response.room = await Room.findById(roomId)
      .populate("members", "-password")
      .populate("latestChat", "-room")
      .populate({
        path: "groupAdmin",
        match: { groupAdmin: { $ne: "" } },
        select: "fullname firstname lastname image",
      })
      .exec();

    response.room = await User.populate(response.room, {
      path: "latestChat.sender",
      select: "fullname firstname lastname image",
    });

    // console.log(response.rooms);
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function searchRooms(type, query, clientId) {
  await dbConnect();
  let response = {
    rooms: [],
  };

  try {
    if (type == "all") {
      const targetIds = (
        await User.find({
          $or: [
            { firstname: { $regex: query, $options: "i" } },
            { lastname: { $regex: query, $options: "i" } },
          ],
        }).exec()
      ).map((user) => user._id.valueOf);

      const names = (
        await User.find({
          $or: [
            { firstname: { $regex: query, $options: "i" } },
            { lastname: { $regex: query, $options: "i" } },
          ],
        }).exec()
      ).map((user) => user.fullname);

      console.log(names);
      console.log(targetIds);
      console.log(clientId);

      console.log(targetIds.includes(clientId));

      response.rooms = await Room.find({
        $or: [
          {
            $and: [
              { isGroup: false },
              // { members: { $elemMatch: { $eq: clientId } } },
              // { members: { $elemMatch: { $eq: clientId } } },
              { members: { $elemMatch: { $in: targetIds, $eq: clientId } } },
            ],
          },
          {
            $and: [
              { isGroup: true },
              { groupName: { $regex: query, $options: "i" } },
              { members: { $elemMatch: { $eq: clientId } } },
            ],
          },
        ],
      })
        .populate("members", "-password")
        .populate("latestChat", "-room", Chat)
        .populate({ path: "groupAdmin", match: { groupAdmin: { $ne: "" } } })
        .sort({ updatedAt: -1 })
        .exec();
    } else if (type == "private") {
      const targetIds = (
        await User.find({
          $or: [
            { firstname: { $regex: query, $options: "i" } },
            { lastname: { $regex: query, $options: "i" } },
          ],
        }).exec()
      ).map((user) => user._id);

      response.rooms = await Room.find({
        $and: [
          { isGroup: false },
          { members: { $elemMatch: { $eq: clientId } } },
          { members: { $elemMatch: { $in: targetIds } } },
        ],
      })
        .populate("members", "-password")
        .populate("latestChat", "-room", Chat)
        .sort({ updatedAt: -1 })
        .exec();
    } else if (type == "group") {
      response.rooms = await Room.find({
        $and: [
          { isGroup: true },
          { groupName: { $regex: query, $options: "i" } },
          { members: { $elemMatch: { $eq: clientId } } },
        ],
      })
        .populate("members", "-password")
        .populate("latestChat", "-room", Chat)
        .populate({ path: "groupAdmin", match: { groupAdmin: { $ne: "" } } })
        .sort({ updatedAt: -1 })
        .exec();
    }

    response.rooms = await User.populate(response.rooms, {
      path: "latestChat.sender",
      select: "fullname firstname lastname image",
    });
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function getRooms(userId, type) {
  await dbConnect();
  let response = {
    rooms: [],
  };

  try {
    if (type == "all") {
      response.rooms = await Room.find({
        members: { $elemMatch: { $eq: userId } },
      })
        .populate("members", "-password")
        .populate("latestChat", "-room")
        .populate({ path: "groupAdmin", match: { groupAdmin: { $ne: "" } } })
        .sort({ updatedAt: -1 })
        .exec();
    } else {
      response.rooms = await Room.find({
        members: { $elemMatch: { $eq: userId } },
        isGroup: type == "group" ? true : false,
      })
        .populate("members", "-password")
        .populate("latestChat", "-room")
        .populate({ path: "groupAdmin", match: { groupAdmin: { $ne: "" } } })
        .sort({ updatedAt: -1 })
        .exec();
    }

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
