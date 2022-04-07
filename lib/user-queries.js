import { AvatarGenerator } from "random-avatar-generator";
import { createPrivateRoom } from "./room-queries";
import dbConnect from "./database";
import User from "./models/user-model";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function checkUser(user) {
  await dbConnect();
  let response = {
    found: false,
    userId: null,
    username: null,
    email: null,
    password: null,
  };
  try {
    const data = await User.findOne({
      $or: [{ email: user }, { username: user }],
    })
      .select(["_id", "username", "email", "password"])
      .exec();

    if (data) {
      (response.found = true), (response.userId = data._id);
      response.username = data.username;
      response.email = data.email;
      response.password = data.password;
    }
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function addUser(username, firstname, lastname, email, password) {
  await dbConnect();
  let response = {
    success: false,
    userId: null,
    isExisting: {
      username: false,
      email: false,
    },
  };

  try {
    response.isExisting.username = await User.exists({
      username: username,
    }).exec();
  } catch (err) {
    console.log("username exists query", err);
  }

  try {
    response.isExisting.email = await User.exists({
      email: email,
    }).exec();
  } catch (err) {
    console.log(err);
  }

  if (!response.isExisting.username && !response.isExisting.email) {
    try {
      const generator = new AvatarGenerator();
      let imageUrl = "";
      await cloudinary.uploader
        .upload(generator.generateRandomAvatar(username), {
          folder: `ichatmo/users/${username}`,
          quality: "auto:low",
        })
        .then((result) => {
          imageUrl = result.url;
        })
        .catch((err) => {
          console.log("Error in cloudinary", err);
        });

      const newUser = new User({
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        password: password,
        image: imageUrl,
      });

      await newUser.save();
      response.userId = newUser._id;
      response.success = true;

      await createPrivateRoom(newUser._id, newUser._id);
    } catch (err) {
      console.log(err);
    }
  }
  return response;
}

export async function getUserBasicInfo(id) {
  await dbConnect();
  let response = {
    success: false,
    userData: {},
  };

  let data = null;

  try {
    data = await User.findById(id)
      .select(["username", "email", "firstname", "lastname", "image"])
      .exec();
  } catch (err) {
    console.log(err);
  }

  if (data) {
    response.success = true;
    response.userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      image: data.image,
    };
  }

  return response;
}

export async function searchUser(user) {
  await dbConnect();
  let response = {
    users: [],
  };

  let data = null;

  try {
    data = await User.find({
      $or: [
        // { email: { $regex: user, $options: "i" } },
        { username: { $regex: user, $options: "i" } },
        { firstname: { $regex: user, $options: "i" } },
        { lastname: { $regex: user, $options: "i" } },
      ],
    })
      .select(["firstname", "lastname", "fullname", "username", "image"])
      .exec();
  } catch (err) {
    console.log(err);
  }

  if (data) {
    data.forEach((user) =>
      response.users.push({
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        image: user.image,
      })
    );
  }

  return response;
}
