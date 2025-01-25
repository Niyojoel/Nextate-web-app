import mongoose from "mongoose";

const postDetailSchema = new mongoose.Schema({
  country: String,
  desc: String,
  utilities: {
    type: String,
    required: false,
  },
  fee: {
    type: String,
    required: false,
  },
  pet: {
    type: String,
    required: false,
  },
  income: {
    type: String,
    required: false,
  },
  size: {
    type: Number,
    required: false,
  },
  distanceAway: {
    type: [Object],
  },
  school: {
    type: Number,
    required: false,
  },
  church: {
    type: Number,
    required: false,
  },
  mall: {
    type: Number,
    required: false,
  },
  gym: {
    type: Number,
    required: false,
  },
  bus: {
    type: Number,
    required: false,
  },
  restaurant: {
    type: Number,
    required: false,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: false,
  },
  postId: {
    type: mongoose.Schema.ObjectId,
    unique: true,
    required: false,
  },
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 200,
    },
    address: {
      type: String,
      unique: true,
    },
    latitude: Number,
    longitude: Number,
    city: String,
    price: Number,
    images: [String],
    bedroom: Number,
    bathroom: Number,
    type: {
      type: String,
      enum: ["buy", "rent"],
    },
    property: {
      type: String,
      enum: ["apartment", "house", "condo", "land"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    postDetail: {
      type: postDetailSchema,
      select: false,
      required: false,
    },
    savedPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "savedPost",
        unique: true,
        required: false,
      },
    ],
    isSaved: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// postSchema.pre(/^find/, function (next) {
//   this.find({isDeleted :{ $ne: true}})
//   next();
// });

const Post = mongoose.model("Post", postSchema);

export default Post;
