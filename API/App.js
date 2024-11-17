import express from 'express';
// import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import usersRoute from "./routes/usersRouter.js"; //.js addition
import postsRoute from "./routes/postsRouter.js";
import authRoute from "./routes/authRouter.js";
import testsRoute from "./routes/testsRouter.js";
import chatsRoute from "./routes/chatsRouter.js";
import messagesRoute from "./routes/messagesRouter.js";
import fs from "fs"


const app = express();

app.use(express.static(`${fs.__dirname}/public`));
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))

const homePage = fs.readFileSync("./public/index.html", 'utf-8')


app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/auth', authRoute);
app.use('/api/tests', testsRoute);
app.use('/api/chats', chatsRoute);
app.use('/api/messages', messagesRoute);

app.get("/", (req, res) => {
    // res.setHeader({"content-type": "text/html"})
    res.send(homePage);
})

export default app;