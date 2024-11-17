import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;
  const {text} = req.body; 

  // console.log(chatId)
  // console.log(text)
  try{
    const chatExist = await Chat.findOne({_id: chatId, users: {$in: [tokenUserId]}});
    if(!chatExist) {
      return res.status(404).json({message: "Chat not found"});
    }

    const message = await Message.create({
      text,
      chat: chatId,
      userId: tokenUserId,
    });

    await Chat.findByIdAndUpdate(chatId, {seenBy: [tokenUserId], lastMessage: text, $push: {messages: [message._id]}}, {new: true, runValidators: true});

    res.status(200).json({message: "success", data: message})
  } catch (err) {
    console.log(err);
    res.status(400).json({message: "Failed to get messages"})
  }
};