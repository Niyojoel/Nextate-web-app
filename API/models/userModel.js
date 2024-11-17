import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      maxlength: [30, "Name can not be more than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: [true, "An account already exist with this email"],
    },
    phone: {
      type: String,
      unique: [true, "An account is registered with this number"],
      required: [true, "Please provide a phone number"],
      minlength: 7,
      maxlength: 15,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    username: {
      type: String,
      required: [true, "A user must have a username"],
      unique: [true, "Username already chosen"],
    },
    avatar: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    posts: [
        {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: false
      }
    ],
    savedPosts: [
        {
        type: mongoose.Schema.ObjectId,
        ref: 'SavedPost',
        // unique: true,
        required: false
      }
    ],
    chats: [
        {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat',
        required: false
      }
    ],
    chatIDs: [
      {
        type: String,
        required: false
      }
    ]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

