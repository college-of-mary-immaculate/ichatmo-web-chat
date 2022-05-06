import mongoose from "mongoose";
import { AvatarGenerator } from "random-avatar-generator";
import { createPrivate } from "./room-queries";
import dbConnect from "./database";
import User from "./models/user-model";
import { compare, hash } from "bcrypt";
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
      .select(["username", "email", "password"])
      .exec();

    if (data) {
      response.found = true;
      response.userId = data._id;
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
    existing: {
      username: false,
      email: false,
    },
  };

  try {
    const usernameExists = await User.exists({
      username: username,
    }).exec();

    if (usernameExists) {
      response.existing.username = true;
    }
  } catch (err) {
    console.log("username exists query", err);
  }

  try {
    const emailExists = await User.exists({
      email: email,
    }).exec();

    if (emailExists) {
      response.existing.email = true;
    }
  } catch (err) {
    console.log(err);
  }

  if (!response.existing.username && !response.existing.email) {
    try {
      const generator = new AvatarGenerator();
      let id = new mongoose.Types.ObjectId();
      let imageUrl = "";
      let imageId = "";
      await cloudinary.uploader
        .upload(generator.generateRandomAvatar(username), {
          folder: `ichatmo/users/${id}`,
          quality: "auto:low",
        })
        .then((result) => {
          imageId = result.public_id;
          imageUrl = result.url;
        })
        .catch((err) => {
          console.log("Error in cloudinary", err);
        });

      const newUser = new User({
        _id: id,
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        password: password,
        image: { id: imageId, url: imageUrl },
      });

      await newUser.save();
      response.userId = newUser._id;
      response.success = true;

      await createPrivate(newUser._id, newUser._id);
    } catch (err) {
      console.log(err);
    }
  }
  return response;
}

export async function updateUserInfo(id, body) {
  await dbConnect();
  let response = {};

  if (body.username) {
    try {
      let usernameExists = await User.exists({
        $and: [{ username: body.username }, { _id: { $ne: id } }],
      }).exec();

      if (usernameExists) {
        response = {
          success: false,
          field: "username",
          exists: true,
          message: "the username is already in use by others",
        };

        return response;
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (body.email) {
    try {
      let emailExists = await User.exists({
        $and: [{ email: body.email }, { _id: { $ne: id } }],
      }).exec();

      if (emailExists) {
        response = {
          success: false,
          field: "email",
          exists: true,
          message: "the email is already in use by others",
        };

        return response;
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (body.password) {
    try {
      const data = await User.findById(id).select("password").exec();
      const passwordMatch = await compare(body.password, data.password);
      if (!passwordMatch) {
        response = {
          success: false,
          field: "password",
          match: false,
          message: "wrong password",
        };

        return response;
      } else {
        body.password = await hash(body.newPassword, 10);
        delete body.newPassword;
      }
    } catch (err) {
      console.log(err);
    }
  }

  try {
    let newImage = "";
    let userChanges = null;
    if (body.image) {
      await cloudinary.uploader
        .upload(body.image.url, {
          quality: "auto:low",
          public_id: body.image.id,
        })
        .then((result) => {
          newImage = { id: body.image.id, url: result.url };
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (newImage) {
      userChanges = await User.findByIdAndUpdate(
        id,
        {
          ...body,
          image: newImage,
        },
        { new: true }
      )
        .select([
          "username",
          "email",
          "fullname",
          "firstname",
          "lastname",
          "image",
        ])
        .exec();
    } else {
      userChanges = await User.findByIdAndUpdate(
        id,
        {
          ...body,
        },
        { new: true }
      )
        .select([
          "username",
          "email",
          "fullname",
          "firstname",
          "lastname",
          "image",
        ])
        .exec();
    }

    response = {
      success: true,
      updatedInfo: userChanges,
    };

    // console.log(response);

    return response;
  } catch (err) {
    console.log(err);
  }
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
      .select([
        "username",
        "email",
        "fullname",
        "firstname",
        "lastname",
        "image",
      ])
      .exec();
  } catch (err) {
    console.log(err);
  }

  if (data) {
    response.success = true;
    response.userData = data;
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
