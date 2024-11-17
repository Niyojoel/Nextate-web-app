import jwt from "jsonwebtoken";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import SavedPost from "../models/savedPostsModel.js";

export const getPosts = async (req, res) => {
    const {type, city : cityValue, bedroom, minPrice, maxPrice, property, agent: agentId} = req.query

    console.log(req.query)

    const city = cityValue && cityValue.length > 1 &&
      `${cityValue.trim()[0]?.toUpperCase()}${cityValue.trim().slice(1)}`;

    try{
      let posts;
      posts = await Post.find({
        // ...(city && city.length > 1 && { city: {$regex: /city/i} }),
        isDeleted: false,
        ...(city && {city}),
        ...(type && type !== "All" && { type: type.toLowerCase().trim() }),
        ...(minPrice &&
          maxPrice && { price: { $gte: minPrice * 1, $lte: maxPrice * 1 } }),
        ...(bedroom && { bedroom: { $gt: bedroom * 1 } }),
        ...(property && { property: property.trim() }),
        ...(agentId && { user: agentId }),
      });

      if(!posts.length > 0) {
        posts = await Post.find({
          isDeleted: false,
          ...(city && { "postDetail.country": city }),
          // ...(city && city.length > 1 && { "postDetail.country": {$regex: /city/i} }),
          ...(type && type !== "All" && { type: type.toLowerCase().trim() }),
          ...(minPrice &&
            maxPrice && { price: { $gte: minPrice * 1, $lte: maxPrice * 1 } }),
          ...(bedroom && { bedroom: { $gt: bedroom * 1 } }),
          ...(property && { property: property.trim() }),
          ...(agentId && { user: agentId }),
        });
      };

      console.log(posts.length)
      console.log((await Post.find({})).length);

      let agent;
      if (agentId) {
        agent = await User.findById(agentId).select(
          "name username email phone avatar"
        );
      }

      console.log(agent)

      res.status(200).json({message: "success", data: {posts, agent}})
    } catch (err) {
      console.log(err);
      res.status(400).json({message: "Failed to get posts"})
    }
};

export const createPost = async (req, res) => {
    const {desc, country, size, income, utilities, pets, school, bus, restaurant, mall, church, gym, ...postBody} = req.body;

    const tokenUserId = req.userId;

    try{
      const post = await Post.create({
        ...postBody,
        user: tokenUserId,
        postDetail: {
          country,
          desc,
          size,
          income,
          utilities,
          pets,
          school,
          bus,
          restaurant,
          mall,
          church,
          gym,
        }
      });

      await User.findByIdAndUpdate(tokenUserId, {$push: {posts: [post._id]}});

      res.status(200).json({message: "Post created successfully", data: post})
    } catch (err){
      console.log(err);
      res.status(500).json({message: "Failed to create post"})
    }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById({_id: req.params.id}).select("+postDetail").populate({path: "user", select:"name username email phone avatar"});
    
    const token = req.cookies?.token;
    
    if(token){
      jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, payload) => {
        if (!err) {
          const postSaved = await SavedPost.findOne({ postId: req.params.id, userId: payload.id});
          return res.status(200).json({message: "success", data: {...post._doc, isSaved: postSaved ? true : false}});
        } else {
          console.log(err)
          return res.status(403).json({ message: "Token is Invalid" });
        }
      });
      return;
    }

    return res.status(200).json({message: "success", data: {...post._doc}});

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to get posts" });
  }
};

export const editPost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const {desc, country, size, income, utilities, pets, school, bus, restaurant, mall, church, gym, ...postBody} = req.body;
  console.log(req.files)

  console.log(req.body.images.file);
  console.log(req.body.images)

  try {
    const post = await Post.findById(id);

    if (post.user.toString() !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to execute  this" });
    }

    const editedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...postBody,
        postDetail: {
          country,
          desc,
          size,
          income,
          utilities,
          pets,
          school,
          bus,
          restaurant,
          mall,
          church,
          gym,
        },
      },
      { new: true, runValidators: true }
    );
    console.log(editedPost);
    res.status(200).json({ message: "success", data: editedPost });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to edit posts" });
  }
};

export const markFavorite = async (req, res)=> {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id);

    if (post.user.toString() !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to execute  this" });
    }

    if(post.isFavorite === true) {
      const favPost = await Post.findByIdAndUpdate(id, { isFavorite: false }, {new: true});
      console.log(favPost);
      return res.status(200).json({ message: "Post unmarked as favorite", data: favPost });
    }

    const favPost = await Post.findByIdAndUpdate(
      id,
      { isFavorite: true },
      { new: true }
    );
    console.log(favPost);
    res.status(200).json({message: "Post marked as favorite", data: favPost})
  } catch(err) {
    console.log(err);
    res.status(400).json({ message: "Failed to mark post as favorite" });
  }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    console.log(tokenUserId)

    try {
      const post = await Post.findById(id);

      if (post.user.toString() !== tokenUserId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to execute  this" });
      }
      await Post.findByIdAndUpdate(id, {isDeleted: true});

      res.status(200).json({ message: "Post successfully deleted"});
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Failed to get posts" });
    }
};
