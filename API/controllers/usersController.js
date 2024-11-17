// import prisma from "../lib/prisma.js";
import User from "../models/userModel.js";
import SavedPost from "../models/savedPostsModel.js";
import Post from "../models/postModel.js";
import Chat from "../models/chatModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json({ message: "success", data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch users!" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    res.status(200).json({ message: "success", data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch user!" });
  }
};

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    console.log(req.file)

    const {avatar, ...inputs} = req.body
    
    if(id !== tokenUserId) {
        return res.status(403).json({message: "Not Authorized!"})
    }

    try { 
        const user = await User.findByIdAndUpdate(
          id,
          { ...inputs, ...(avatar && { avatar }) },
          { new: true, runValidators: true }
        );
        console.log(user)
        res.status(200).json({ message: "User updated successfully!", data: user });
    } catch (err) {
      console.log(err);  
      res.status(500).json({ message: "Failed to edit user!" });
    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    console.log(id, tokenUserId)

    if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
    }
    try {
        // await prisma.user.delete({where: {id} });
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted" });
    } catch (err){
        console.log(err);
        res.status(500).json({ message: "Failed to delete user!" });
    }
};

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId= req.userId;

    console.log(postId)
    console.log(tokenUserId)

    try {
      const savedPost = await SavedPost.findOne({userId: tokenUserId, postId: postId})
      console.log(savedPost)
        if(savedPost !== null) {
          await SavedPost.findByIdAndDelete(savedPost._id);
          await Post.findByIdAndUpdate(postId, {isSaved: false})
          return res.status(200).json({ message: "Post removed from saved list" });
        }
        await SavedPost.create({userId: tokenUserId, postId: postId})
        await Post.findByIdAndUpdate(postId, {isSaved: true, $push: {savedPosts : [tokenUserId]}})
        res.status(200).json({ message: "Post saved" });
    } catch (err){
        console.log(err);
        res.status(500).json({ message: "Failed to save post!" });
    }
};

export const getProfilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const userPosts = await Post.find({user: tokenUserId, isDeleted: {$ne: true}});
    const userSavedPostsAll = await SavedPost.find({userId: tokenUserId}).populate("postId");

    const userSavedPosts = userSavedPostsAll.map(each=> { return each.postId})

    res.status(200).json({ message: "success", data: {userPosts, userSavedPosts} });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user's posts!"});
  }
};

export const getNotification = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chatsUnSeen = await Chat.find({ users: {$in: [tokenUserId]}});
    const chatsNotSeen = chatsUnSeen.filter(chat=> !chat.seenBy.includes(tokenUserId))
    res.status(200).json({ message: "success", data: chatsNotSeen.length });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch chat count posts!"});
  }
};

export const getAgents = async (req, res) => {
  try {
    const users = await User.find({posts: { $ne: []}});

    console.log(users);
    res.status(200).json({ message: "success", data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch users!" });
  }
};