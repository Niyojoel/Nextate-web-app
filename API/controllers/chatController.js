import Chat from "../models/chatModel.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await Chat.find({
      users: { $in: [tokenUserId] },
    }).populate({ path: `users`, select: "username avatar", transform: (doc) => {
      return doc._id.toString() !== tokenUserId ? doc : doc._id; 
    }});

    res.status(200).json({ message: "success", data: chats });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to get chats" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  console.log(req.params.id);

  try {
    const chat = await Chat.findOne({_id: req.params.id, users: {$in: [tokenUserId]}}).populate({path: "messages", options: {sort: "createdAt"}});
  
    //updating seen by field
    await Chat.findByIdAndUpdate(req.params.id, {$push: {seenBy: [tokenUserId]}});

    res.status(200).json({ message: "success", data: chat});
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to get chat" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const {receiverId} = req.body; 

  console.log(tokenUserId.toString());
  console.log(receiverId.toString());

  try {
    const chatExist = await Chat.findOne({
      users: { $in: [receiverId], $in: [tokenUserId] },
    });

    console.log({chatExist: chatExist});

    if(chatExist) {
      return res.status(200).json({ message: "exiting success", data: chatExist });
    } 

    const chat = await Chat.create({
      users: [tokenUserId, receiverId]
    }, {new: true, runValidators: true});

    console.log(chat);

    res.status(200).json({ message: "success", data: chat });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to add chat" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOneAndUpdate({_id: req.params.id, users: {$in: [tokenUserId]}}, {
      $push: { seenBy: [tokenUserId]},
    });

    // console.log(chat);

    res.status(200).json({ message: "success", data: chat });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to read chat" });
  }
};
