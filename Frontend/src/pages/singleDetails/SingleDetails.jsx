import React, { useEffect, useState } from 'react';
import "./singleDetails.scss";
import {Slider, Features, Map} from "../../components";
import {FaBath,FaBorderAll, FaBus, FaPhone, FaRegBookmark, FaRegEdit, FaRegStar, FaShoppingCart, FaStar} from 'react-icons/fa';
import {IoBedOutline, IoCashOutline, IoConstructOutline, IoPerson, IoRestaurant, IoSchool } from "react-icons/io5";
import {IoIosMail, IoIosResize} from 'react-icons/io';
import {FaBookmark, FaBuilding, FaCat,FaChurch,FaDumbbell,FaHandshake,FaLocationDot,FaRegMessage} from 'react-icons/fa6';
import {v4 as uuidv4} from "uuid";
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/useContext';
import apiRequest from '../../lib/apiRequest';

const distAwayIcons = [<FaChurch/>, <IoSchool/>, <FaBus/>, <IoRestaurant/>,<FaShoppingCart/>, <FaDumbbell/>]


const SingleDetails = () => {
  const {user, setInitMessage} = useGlobalContext();
  const postRes = useLoaderData();
  const post = postRes.data
  const {postDetail} = post;
  const {church, school, bus, mall, restaurant, gym} = postDetail;
  const places= ["Church", "School", "Bus", "Mall", "Restaurant", "Gym"]
  const postDist = [church, school, bus, restaurant, mall, gym]
  
  const [saved, setSaved] = useState(post.isSaved && post.savedPosts.includes(user?._id));
  const [favorite, setFavorite] = useState(post.isFavorite);
  const navigate = useNavigate()

  const handleSave = async ()=> {
    if(!user) {
      navigate("/signin")
    }
    try{
      const res = await apiRequest.post("/users/save", {postId: post._id});
      console.log(res)
      setSaved(prev => !prev);
    } catch (err) {
      console.log(err)
    }
  }

  const editContent = (id) => {
    navigate(`/profile/editpost/${id}`);
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

  const handleSendMessage = async ()=> {
    try {
      const chatRes = await apiRequest.post("/chats", {receiverId: post.user})
      const postRes = await apiRequest.get(`/posts/${post._id}`);
      navigate("/profile");
      setInitMessage({state: true, chatId: chatRes?.data?.data._id, receiver: postRes.data.data.user});
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className='container changeFlex'> 
      <div className="left">
        <div className="wrapper singlesWrapper">
            <Slider imgs = {post.images}/>
        <div className="info">
          <div className="headline">
            <h1>{post.title}</h1>
            <div className="price postPrice"> ${post.price} </div>
          </div>
          <div className="postDetails">
            <div className='postWrapper'>
              <div className="desc">
                <p className='heading'> Description</p>
                {postDetail.desc} 
              </div>
              <div className="row1">
                <div className="partition col1">
                  <p className="heading">Overview</p>
                  <div className="address">
                    <i className='icon'> <FaLocationDot/></i>
                    <span>{post.address}, {post.city}, {postDetail.country}.</span>
                  </div>
                  <div className="address">
                    <i className='icon'> <FaBuilding/></i>
                    {post.property}.
                  </div>
                  <div className="address">
                    <i className='icon'> <FaHandshake/></i>
                    {post.type}.
                  </div>
                  <div className="address">
                    <i className='icon'> <FaBorderAll/></i>
                    {postDetail.size || size}m sq area.
                  </div>
                </div>
                <div className="partition col2">
                  <p className='heading'> Distances away (kms) </p>
                  {postDist.map((el, i)=> {
                    return (
                     <div className="address dist" key={uuidv4()}>
                      <i className='icon'>{distAwayIcons[i]}</i>
                      {places[i]} : {el?.toString().length >= 4 ? `${el/1000} km` : `${el} m`}
                    </div>
                    )
                  })}
                </div>
                <div className="partition col3">
                  <div className="user">
                    <p className='heading'> Agent's info</p>
                    <div className="usercol">
                      <img src={post.user.avatar} alt="user_img" className='userImg'/>
                      <div className="agent">
                        <div className="address name">
                          <i className='icon'><IoPerson/></i>
                        {post.user.name}
                        </div>
                        <div className="address mail">
                          <i className='icon'><IoIosMail/></i>
                        {post.user.email}
                        </div>
                        <div className="address ">
                          <i className='icon'><FaPhone/></i>
                        {post.user.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="partition col4">
                  <div className="postFeat">
                    <p className='heading'> Features</p>
                    <div className="feats">
                      <Features postData = {post}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div className="right">
        <div className="rightfeatures">
          <div className="rightrow">
            <p className='title'>General</p>
            <div className="listVertical">
              <div className="feature">
                <i><IoConstructOutline/></i>
                <div className="featureText">
                  <span>Utilities</span>
                  <p>{postDetail.utilities === "owner's" ? "Owner's responsibilities" : "Tenant's responsibilities"}</p>
                </div>
              </div>
              <div className="feature">
                <i><FaCat/></i>
                <div className="featureText">
                  <span>Pets Policy</span>
                  <p>{postDetail.pet ==="allowed" ? "Pets are allowed" : "Pets are not allowed"}</p>
                </div>
              </div>
              <div className="feature">
                <i><IoCashOutline/></i>
                <div className="featureText">
                  <span>Fees</span>
                  <p>{postDetail.income || "Able to comfortably pay a years rent"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rightrow">
            <p className='title'>Space Area \ Sizes</p>
            <div className="listHorizontal">
              <div className="feature size">
                <i className='resize'><IoIosResize/></i>
                <p>{postDetail.size || size} sqft</p>
              </div>
              <div className="feature size">
                <i className='bed'><IoBedOutline/></i>
                <p>{`${post.bedroom} bedrooms`}</p>
              </div>
              <div className="feature size">
                <i><FaBath/></i>
                <p>{`${post.bathroom} bathrooms`}</p>
              </div>
            </div>
          </div>
          <div className="rightrow">           
            <p className='title'>Nearby Facilities</p>
            <div className="listHorizontal nearby">
              {postDist.sort((a, b)=> a - b).slice(0, 3).map((el, i)=> {
                return (el !== null &&
                <div className="feature" key={uuidv4()}>
                  <i className='icon'>{distAwayIcons[i]}</i>
                  <div className="">
                    <span>{places[i]}</span>
                    <p>{el?.toString().length >= 4 ? `${el/1000} km away` : `${el} m away`} </p>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
          <div className="rightrow">
            <p className='title'>Location</p>
            <div className="mapContainer">
              <Map locations={[post]}/>
            </div>
          </div>
          <div className="rightrow">
            {post.user._id === user?._id ?
              <div className="buttons">
                <button onClick={()=>editContent(post._id)}>
                  <i><FaRegEdit/></i>
                  Edit post
                </button>
                <button type='button' onClick={handleSave}>
                  {saved ? 
                    <><i><FaBookmark/></i> Saved</>
                    :<><i><FaRegBookmark/></i> Save the Place</>}
                </button>
                <button onClick={()=>handleFavorite(post._id)}>
                  {!favorite ? <><i ><FaRegStar/></i>
                  Mark as favorite</> : <><i style={{color: favorite ? "#fece51" : "#305882"}}><FaStar/></i>
                  Favorite</>}
                </button>  
              </div> :
              <div className="buttons">
                <button type='button' onClick={handleSave}>
                  {saved ? 
                    <><i><FaBookmark/></i> Saved</>
                    :<><i><FaRegBookmark/></i> Save the Place</>}
                </button>
                <button onClick={()=>handleSendMessage(post.user._id)}>
                  <i><FaRegMessage/></i>
                  Send Message
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default SingleDetails