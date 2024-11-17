import mongoose from "mongoose";
import app from "./App.js"

let DB;
if(process.env.NODE_ENV === "development") {
  DB = process.env.DATABASE_URL_LOCAL
}else {DB = process.env.DATABASE_URL_REMOTE};

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