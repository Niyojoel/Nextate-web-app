import multer from "multer";
import sharp from "sharp";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file)
    // console.log(req.body.email); //if posts
    cb(null, "../public/images/users"); //use posts in place of users
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.userId}-${Date.now()}.${ext}`); //use postId in place of userId
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    res.status(400).json({ message: "You can only upload images" });
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserAvatar = upload.single("image");

export const uploadPostImages = upload.array("image", 4);


export const resizeUserAvatar = async (req, res, next) => { //change for posts imgs
  if (!req.file) return next();

  req.file.filename = `user-${req.userId}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`../public/images/users/${req.file.filename}`);
  next();
};

export const resizePostImages = async (req, res, next) => {
  if (!req.files.images) return next();

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `post-${req.params.id || req.userId}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/posts/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
};


