import {Server} from "socket.io";

const io = new Server({
    cors: {
        origin: process.env.CLIENT_ORIGIN
    }
});

let onlineUser = [];

const addUser = (userId, socketId)=> {
    const userExist = onlineUser.find((user)=> user.userId === userId);
    if(!userExist) {return onlineUser.push({userId, socketId})};
    return onlineUser;
}

const removeUser = (socketId)=> {
    return onlineUser = onlineUser.filter((user)=> user.socketId !== socketId);
}

const getUser = (userId)=> {
    return onlineUser.find((user)=> user.userId === userId);
}

io.on("connection", (socket)=> {
 socket.on("newUser", (userId)=> {
   addUser(userId, socket.id);
   console.log(addUser(userId, socket.id));
 });

 socket.on("sendMessage", ({receiver_id, data})=> {
  const receiver = getUser(receiver_id);
  io.to(receiver.socketId).emit("getMessage", data);
 });

 socket.on("disconnection", ()=> {
  removeUser(socket.id);
 });
})

const PORT = process.env.SOCKET_PORT;  

io.listen(PORT)