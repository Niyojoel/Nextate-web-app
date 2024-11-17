import mongoose from "mongoose";
import app from "./App.js"

const DB = process.env.DATABASE_URL;

(async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB connection established");
  } catch (err) {
    console.log(err);
  }
})();

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});