import React, { useEffect, useRef, useState } from 'react';
import "./chat.scss";
import { FaTimes } from 'react-icons/fa';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { useGlobalContext } from '../../context/useContext';
import {format} from "timeago.js";
import apiRequest from '../../lib/apiRequest';
import { useSocketContext } from '../../context/socketContext';
import notifyStore from '../../lib/notifyStore';


const Chat = ({chats}) => {

  //page element transform
  const {expand, setExpand} = useGlobalContext()
  const [showChat, setShowChat] = useState(false);
  const [chatFullScreen, setChatFullScreen] = useState(false);
  const chatBoxRef = useRef();
  const chatEndRef = useRef();
  
  //datas
  const {user, showAlert, handleSubmit, setInitMessage, initMessage} = useGlobalContext();
  const {socket} = useSocketContext();
  const [chat, setChat] = useState(null);

  const decrease = notifyStore(state => state.decrease);
  

  useEffect (()=> {
    chatFullScreen ? chatBoxRef.current.classList.add('fullScreen') : chatBoxRef.current.classList.remove('fullScreen');
  },[chatFullScreen]);

  useEffect (()=> {
    if(expand) {
      return setShowChat(false);
    }
  },[expand])

  const handleOpenChat = async (id, receiver)=> {
    try {
      const res = await apiRequest.get(`/chats/${id}`);
      expand === true && setExpand(false);
      setShowChat(true);
      if(!res.data.data.seenBy.includes(user._id)){
        decrease();
      }
      setChat({...res.data.data, receiver})

    } catch(err) {
      console.log(err);
      return showAlert("Something went wrong", "fail")
    }
  }

  const processSubmit = async (e) => {
    try{
      const res = await handleSubmit(e, `/messages/${chat._id}`, "post");
      const data = res.data;
      console.log(data)
      setChat(prev=>({...prev, messages: [...prev.messages, data.data]}));
      e.target.reset();
      console.log(chat.receiver._id, data.data)
      socket.emit("sendMessage", {
        receiver_id: chat.receiver._id,
        data: data.data,
      })
    }catch(err) {
      console.log(err);
    } finally {
      setInitMessage({ state: null, chatId: null, receiver: null});
    } 
  }

  useEffect(()=> {
    const read = async ()=> {
      try{
        return await apiRequest.patch(`/chats/read/${chat._id}`)
      } catch(err) {
        console.log(err)
      }
    }

    if(chat && socket) {
      socket.on("getMessage", (data) => {
        if(chat._id === data.chat) {
          console.log(chat._id, data.chat)
          setChat(prev => ({...prev, messages: [...prev.messages, data]}));
          read();
        }
      })
    }
    return async ()=> {
      socket.off("getMessage");
    }
  }, [chat, socket]) 


  useEffect(()=>{
    chat?._id && chatEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [chat]);

  useEffect(()=> {
    initMessage?.state === true && handleOpenChat(initMessage.chatId, initMessage.receiver)
  }, [initMessage])

  // console.log(chat)

  return (
    <div className={`chatContainer`}>
      <div className={`messages`}>
        <div className="inbox">
          {chats?.map((chat_)=> {
            const chatReceiver = chat_.users.find(item => typeof(item) === "object")
            const chatReceiver_avatar = chatReceiver?.avatar || "/users/noavatar.jpg";
            return (
            chat_?.lastMessage && <div className={"message"} key={chat_._id} onClick={()=> handleOpenChat(chat_._id, chatReceiver)}>
              <div className="sender">
                <img src={chatReceiver_avatar} alt="sender_img" className='userImg'/>
                <span className={expand ? 'rmImg' : undefined}>{chatReceiver?.username.length > 9 ? `${chatReceiver?.username.slice(0, 1)}. ${chatReceiver?.username.split(" ")[1]}`: chatReceiver?.username}</span>
              </div>
              <div className={chat_?.seenBy.includes(user._id) && chat?.seenBy.includes(user._id)? "mssgBody" : "mssgBody mssgBody--unread"} >
                <p className={expand ? 'cropMssg' : ''}>{chat_?.lastMessage} </p>
              </div>
              <span className={chat_?.seenBy.includes(user._id) ? "unreadIcon" : "unreadIcon unreadIcon--unread"}> </span>
            </div>
          )
          })}
        </div>
      </div>
      <div className={!showChat ? 'chatBox remove' : 'chatBox'} ref = {chatBoxRef}>
        <div className="chatTop">
          <div className="sender">
            <img src={chat?.receiver?.avatar || "/users/noavatar.jpg"} alt="user_img" className='userImg'/>
            {expand ? `${chat?.receiver?.username.slice(0, 1)}. ${chat?.receiver?.username.split(" ")[1]}`: chat?.receiver?.username}
          </div>
          <div className="toggleBtns">
            <button className='close' onClick={()=>setShowChat(false)}> <i><FaTimes/></i> </button>
            <button className='toggleFull' onClick={()=> setChatFullScreen(!chatFullScreen)}> <i>{chatFullScreen ? <FaAngleDown/> : <FaAngleUp/>}</i> </button>
          </div>
        </div>
        <div className="chatConsole">
          <div className="chatMessages">
            {chat?.messages?.map((message, i)=> {
              return <div key={message._id} className={message.userId === user._id ? 'chatMessage own' : 'chatMessage'} ref={ i === chat.messages.length - 1 ? chatEndRef : undefined}>
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            })}
          </div>
        </div>
        <form className="chatSend" onSubmit={processSubmit}>
          <textarea name="text" id="text"></textarea>
          <button type='submit'> Send </button>
        </form>
      </div>
    </div>
  )
}

export default Chat