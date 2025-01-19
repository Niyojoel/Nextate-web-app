import React from 'react';
import "./agentCard.scss";
import { IoPerson } from 'react-icons/io5';
import { IoIosMail } from 'react-icons/io';
import { FaMessage, FaPhone, FaRegistered, FaUser, FaUserPen} from 'react-icons/fa6';
import { useGlobalContext } from '../../context/useContext';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';

const AgentCard = ({agent}) => {
    const {user, setInitMessage} = useGlobalContext();
    const navigate = useNavigate();

    const handleSendMessage = async ()=> {
        if(!user) {
        navigate("/signin")
        }
        try {
        const chatRes = await apiRequest.post("/chats", {receiverId: agent._id});
        console.log(chatRes);
        navigate("/profile");
        setInitMessage({state: true, chatId: chatRes?.data?.data._id, receiver: agent});
        } catch (err) {
        console.log(err);
        }
    }
    
    const handleNavToAgentPost = ()=> {
        navigate(`/list?type=All&city=%20&minPrice=0&maxPrice=1000000&agent=${agent._id}`)
    }

  return (user?._id !== agent?._id &&
    <div className="agentCard">
        <img src={agent.avatar} alt="user_img" className='userImg'  onClick={handleNavToAgentPost}/>
        <div className="agentInfo">
            <div className="agentInfo-top">
                <div className='inforow'>
                    <div className="address address-agent">
                        <i className='icon'><IoPerson/></i>
                        {agent.name}
                    </div>
                    <div className="address address-agent">
                        <i className='icon'><IoIosMail/></i>
                        {agent.email}
                    </div>
                    <div className="address address-agent">
                        <i className='icon'><FaPhone/></i>
                        {agent.phone}
                    </div>
                </div>
                <div className='inforow'>
                    <div className="address address-agent">
                        <i className='icon'><FaUserPen/></i>
                    {agent.posts.length} post{agent.posts.length > 1 && "s"}
                    </div>
                    <div className="address address-agent">
                        <i className='icon'><FaUser/></i>
                    {agent.country || "not specified"}
                    </div>
                    <div className="address address-agent">
                        <i className='icon'><FaRegistered/></i>
                    {agent.createdAt.replace(agent.createdAt.slice(agent.createdAt.indexOf("T")), " ")}
                    </div>
                </div>
            </div>
            <div className="agentInfo-bottom">
               <button className="address address-agent" onClick={()=>handleSendMessage()}>
                    <i className='icon'><FaMessage/></i>
                    Send Message
                </button>
                <button className="address address-agent" onClick={handleNavToAgentPost}>
                    <i className='icon'><FaUserPen/></i>
                    View Posts by Agent
                </button>
            </div>
        </div>
    </div>
  )
}

export default AgentCard