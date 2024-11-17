import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    postId: {
      type: String,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);

// savedPostSchema.virtual("post", {
//   ref: "Post",
//   foreignField: "_id", 
//   localField: "postId", 
// });

const SavedPost = mongoose.model("SavedPost", savedPostSchema) 

export default SavedPost;

