import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  users: [
    {
      type: String,
      ref: "User",
      required: true,
      // unique: true,
    }
  ],

  seenBy: [
    {
      type: String,
      ref: "User",
    },
  ],
  messages: [
    {
      type: String,
      ref: "Message",
    },
  ],
  lastMessage: String,
}, {
  timestamps: true,
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
