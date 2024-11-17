import mongoose from "mongoose";

const messageSchema = new mongoose.Schema ({
    text: {
        type: String,
        trim: true
    },
    userId: String,
    chat: {
        type: String,
        ref: "Chat"
    },
},
{
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema)

export default Message;