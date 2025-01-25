import React, { Suspense, useEffect} from 'react';
import "./profile.scss";
import {Posts, ProfileBtns, Chat, Alert} from "../../components"
import {Await, Link, useLoaderData, useNavigate, useResolvedPath} from "react-router-dom";
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa6';
import {useGlobalContext} from '../../context/useContext';
import {v4 as uuidv4} from "uuid";
import apiRequest from '../../lib/apiRequest';
import { useSocketContext } from '../../context/socketContext';


const chatComponentKey = uuidv4();

const Profile = () => {
  const {expand, setExpand, user, updateUser, message, showAlert, updateLoading, getPath} = useGlobalContext();
  const data = useLoaderData();
  const {socket} = useSocketContext(); 
  const navigate = useNavigate();

  const {pathname} = useResolvedPath()

  const path = pathname.split("/")[1]

  useEffect(()=> {
    getPath(path)
  }, [])

  const handleLogout = async(e)=> {
    try {
      socket.emit("disconnection");
      const res = await apiRequest.post("/auth/logout");
      const data = await res.data;
      console.log(data.message)
      showAlert('Logging Out...', 'success', 3000);
      setTimeout(() => {
        updateUser(null)
        navigate("/");
      }, 3000);
    } catch(err){
      console.log(err);
      showAlert(err.response.data.message, 'fail');
    } finally {
      setTimeout(() => {
        updateLoading(false);
      }, 3000);
    }
  }

  return (
    <section className='container changeFlex page_nav-gap'>
      <div className={`left ${expand ? 'profileLeft' : undefined}`}>
          <button className={`resizeLeft ${expand ? 'adjust' : undefined}`} onClick={()=>setExpand(!expand)}>
            {!expand && <i className='icon'><FaAngleRight/></i>}
            {expand && <i className='icon'><FaAngleLeft/></i>}
          </button>
        <div className="wrapper profileWrapper">
          {message && <Alert/>}
          <div className="articleRow1">
            <article className='profileRow'>
              <header className='title'>
                <h1>My Profile</h1>
                <ProfileBtns handleLogout={handleLogout}/>
              </header>
              <div className="profileData topRow">
                <div className='imgBcg'>
                  <img src={user?.avatar || "/users/noavatar.jpg"} alt="user_profile_image" className='userImg'/>
                </div>
                <div className="row1 row1-profile">
                  <div className="partition partition-profile">
                    <p> Name : <span>{user?.username}</span></p>
                    <p>Email : <span>{user?.email}</span></p>
                    <p>Phone line : <span>{user?.phone}</span></p>
                  </div>
                  <div className="partition partition-profile">
                    <p>Posts Added: <span>{user?.posts?.length > 0 ? `${user.posts.length} post${user.posts.length > 1 ? "s": ""}` : "No posts"}</span></p>
                    <p> Registered on : <span>{user?.createdAt.replace(user?.createdAt.slice(user?.createdAt.indexOf("T")), " ")}</span></p>
                    <p> Base Country : <span>{user?.country}</span></p>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div className="articleRow2">
            {<article className='profileRow'>
              <header className='title'>
                <h1>My Posts</h1>
                <Link to="/profile/addpost"><button className='register reg-profile'>Create New Post</button></Link>
              </header>
              <div className="profileData postsData">
                <Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={data.postResponse} errorElement={<h3>Error Loading Posts</h3>}>
                        {(postResponse) => {
                          return postResponse.data.data && <Posts dataList={postResponse.data.data.userPosts} noMssgBtn setExpand={setExpand}/>
                        }}
                    </Await>
                </Suspense>
              </div>
            </article>}
            <article className='profileRow savedList'>
              <header className='title'>
                <h1>Saved List</h1>
              </header>
              <div className="profileData postsData">
                <Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={data.postResponse} errorElement={<h3>Error Loading Posts</h3>}>
                        {(postResponse) => {
                          return postResponse.data.data && <Posts dataList={postResponse.data.data.userSavedPosts} setExpand={setExpand}/>
                        }}
                    </Await>
                </Suspense>
              </div>
            </article>
          </div>
        </div>
      </div>
      <div className={`right contentRight ${expand ? 'profileRight' : undefined}`}>
        <section className="chat">
          <h1> Messages</h1>
            <Suspense fallback={<h2>Loading...</h2>}>
              <Await resolve={data.chatResponse} errorElement={<h3>Error Loading Messages</h3>}>
                {(chatResponse) => {
                  return <Chat key= {chatComponentKey} chats={chatResponse.data.data} expand={expand}/>
                }}
              </Await>
            </Suspense>
        </section>
      </div>
    </section>
  )
}

export default Profile
