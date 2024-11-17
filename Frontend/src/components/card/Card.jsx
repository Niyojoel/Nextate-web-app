import React, { useRef, useState } from 'react';
import "./card.scss";
import { Link, useNavigate } from 'react-router-dom';
import {Features} from '../';
import { FaBookmark, FaCircle, FaLocationDot, FaRegBookmark, FaRegMessage, FaSquare} from 'react-icons/fa6';
import { FaCheck, FaRegEdit, FaRegStar, FaStar, FaTimes, FaTrashAlt, FaUser} from 'react-icons/fa';
import {v4 as uuidv4} from "uuid";
import { useGlobalContext } from '../../context/useContext';
import apiRequest from '../../lib/apiRequest';

const Card = ({post, bcg, noMssgBtn, removeCard, editContent, setExpand}) => {
  const {user, setInitMessage, path} = useGlobalContext();
  const {_id, images, address, title, property, price, type, isSaved } = post;

  //Post functionality -----------------------
  const [saved, setSaved] = useState(isSaved && post.savedPosts.includes(user?._id));
  const [favorite, setFavorite] = useState(post.isFavorite);

  const navigate = useNavigate();
  const deleteAlertRef = useRef();

  const handleSave = async ()=> {
    if(!user) {
      navigate("/signin")
    }
    try{
      const res = await apiRequest.post("/users/save", {postId: post._id});
      console.log(res)
      if (saved === true) {
        removeCard && !noMssgBtn && removeCard(_id);
      } 
      setSaved(prev => !prev);
    } catch (err) {
      console.log(err)
    }
  }

  const handleDltAlert = (display) => {
    return display === "open" ? deleteAlertRef.current.classList.add("deleteAlert-show") : deleteAlertRef.current.classList.remove("deleteAlert-show");
  }

  const handleDelete= (id, type) => {
    removeCard(id, type);
    deleteAlertRef.current.classList.remove("deleteAlert-show");
  }

  const handleSendMessage = async ()=> {
    if(!user) {
      navigate("/signin")
    }
    try {
      const chatRes = await apiRequest.post("/chats", {receiverId: post.user})
      const postRes = await apiRequest.get(`/posts/${post._id}`);
      navigate("/profile");
      setInitMessage({state: true, chatId: chatRes?.data?.data._id, receiver: postRes.data.data.user});
    } catch (err) {
      console.log(err);
    }
  }

  const handleFavorite = async (id)=>{
    try{
      const res = await apiRequest.patch(`/posts/mark-favorite/${id}`);
      console.log(res);
      setFavorite(prev => !prev);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <article className= {`card ${bcg}`}>
      <div className="card-top">
        <Link to={`/${post._id}`} className='propertyImg' onClick={()=>setExpand(false)}>
          <figure className='cardImg'>
            {!noMssgBtn && post.user === user?._id && <span className='myPost'><FaUser/></span>}
            <img src={images && images[0]} alt={title}/>
            <div className="overlay"> <p>See Details</p> </div>
          </figure>
        </Link>
        <div className="details"> 
          <div className="tagLine">
            <Link to={`/${_id}`}>
              <h2 className='title'>{title}</h2> 
            </Link>
            <span className="types">
              {[type]?.map(el => {
                return (!noMssgBtn ? <Link to={`/list?type=${el}&city=&minPrice=0&maxPrice=10000000`} key={el} className='address type'>{el}</Link> : <span className='address type nopointer'> {el} </span>)
              })}
              {[property]?.map(el => {
                return (!noMssgBtn ? <Link to={`/list?type=All&property=${el}&city=&minPrice=0&maxPrice=10000000`} key={el} className='address type category'><span>{el}</span></Link> : <span className='address type nopointer category '> {el} </span>)
              })}
            </span>
          </div>
          <p className='address'>
            <i className='icon'><FaLocationDot/></i>
            <span>{address}</span>
          </p>
          <p className='price'>$ {price}</p>
          <div className="bottom">
            <Features postData = {post} limit/>
            <div className="icons">
              {noMssgBtn && favorite && <button className="cardIcon" onClick={()=>handleFavorite(post._id)}>
                {!favorite ? <i ><FaRegStar/></i>
                : <i style={{color: favorite ? "#fece51" : "#305882"}}><FaStar/></i>}
              </button>}
              {!noMssgBtn && <button className="cardIcon" onClick={()=>handleSave(_id)}>
                {saved ? <i className='icon'><FaBookmark/></i> :<i className='icon'><FaRegBookmark/></i>}
              </button>}
              {!noMssgBtn && post.user !== user?._id && <button className="cardIcon" onClick={()=>handleSendMessage()}>
                <i className='icon'><FaRegMessage/></i>
              </button>}
              {noMssgBtn && <button className="cardIcon" onClick={()=> editContent(_id)}>
                <i className='icon'><FaRegEdit/></i>
              </button>}
              {noMssgBtn && <button className="cardIcon" onClick={()=> handleDltAlert("open")}>
                <i className='icon'><FaTrashAlt/></i>
              </button>}
              {!noMssgBtn && post.user === user?._id && path !== "profile" && <button className="cardIcon userPost" onClick={()=> navigate("/profile")}>
                <i className='icon userOwn'><FaUser/></i>
              </button>}
            </div>
          </div>
        </div>
      </div>
      <div className="deleteAlert" ref={deleteAlertRef}>
        <p>You are about to delete this post  
          <button className='deletePostbtn' onClick={()=>handleDelete(_id, "delete")}><FaCheck/></button> 
          <button className='deletePostbtn' onClick={handleDltAlert}><FaTimes/></button> 
        </p>
      </div>
    </article>
  )
}

export default Card