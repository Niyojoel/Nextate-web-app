import React, { useCallback, useState } from 'react';
import "./posts.scss";
import {Card} from "../";
// import {v4 as uuidv4} from "uuid";
import apiRequest from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';

const Posts = ({dataList, noMssgBtn, setExpand}) => {
  const [posts, setPosts] = useState(dataList);
  const navigate = useNavigate();
  
 
  const removeCard = async (id, action) => {
    console.log(id);
    const newPosts = posts.filter(post => post._id !== id);
    if(action === "delete") {
      const res = await apiRequest.delete(`/posts/${id}`);
      console.log(res);
    }
    return setPosts(newPosts);
  };

  const editContent = (id) => {
    navigate(`/profile/editpost/${id}`);
  }

  return (
    <section className='userPosts'>
        {posts.map((post, index)=> {
            return <Card key={index} post={post} bcg='whiteBcg' setExpand={setExpand} noMssgBtn={noMssgBtn} removeCard={removeCard} editContent={editContent} />
        })}
    </section>
  )
}

export default Posts