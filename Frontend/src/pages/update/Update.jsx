import React, { useEffect, useRef, useState } from 'react';
import "./update.scss"
import { FaAngleRight, FaSpinner } from 'react-icons/fa6';
import {useGlobalContext} from '../../context/useContext';
import { Link, useNavigate, useResolvedPath } from 'react-router-dom';
import { Alert, UploadWidget } from '../../components';

const Update = () => {
  const {message, isLoading, handleSubmit, user, updateUser, showAlert, updateLoading, changeMade, setChangeMade, avatar, getPath, setExpand} = useGlobalContext();
  const navigate = useNavigate();

  const {pathname} = useResolvedPath();

  const path = pathname.split("/")[2];

  const handleChange = (e)=> {
    e.target.value === e.target.defaultValue ? setChangeMade(false) : setChangeMade(true);
  }

  useEffect(()=>{
    setExpand(false);
    getPath(path);
  }, []);

  console.log(path);
  
  const processSubmit = async (e)=>{ 
    e.preventDefault();
    if(changeMade === false) return showAlert('You have not made any change', 'fail')
    try{
      const res = await handleSubmit(e, `/users/${user._id}`, "patch");
      const data = await res.data;
      console.log(data);
      setTimeout(() => {
        showAlert(data.message, 'success', 1500);
        updateUser(data.data);
      }, 1000);
      setTimeout(() => {
        setChangeMade(false);
        navigate("/profile");
      }, 3000);
    }catch(err) {
      console.log(err);
      showAlert(err.response.data.message, 'fail');
    }finally {
      setTimeout(() => {
        updateLoading(false)
      }, 3000);
    }
  }

  useEffect(()=> {
    avatar === user.avatar ? setChangeMade(false) : setChangeMade(true)
  }, [avatar])
  
  return (
    <section className='container reverseFlex homeWrapper'>
     <form className='mainForm' onSubmit={processSubmit}>
      <div className="left spanMajority">
        <div className="wrapper jc">
          <figure className='banner'><img src='/imgedit.png' alt="" /></figure>
          {message && <Alert/>}
          <div className="connectform accRight">
              <h1>Update Profile</h1>
              <div className='loginform'>
                  <div className="input">
                  <input type="text" id='username' name='username' defaultValue={user.username} placeholder='Username'  onChange={handleChange} autoFocus/>
                  </div>
                  <div className="input">
                  <input type="email" id='email' name='email' defaultValue={user.email} placeholder='my@gmail.com' onChange={handleChange}/>
                  </div>
                  <div className="input">
                  <input type="text" id='country' name='country' defaultValue={user.country} placeholder='Base country' onChange={handleChange}/>
                  </div>
                  <button type= 'submit' className={changeMade === false ? "changeNotmade" : undefined} disabled={isLoading}> {isLoading ? <FaSpinner/> : 'Submit'}</button>
              </div>
              <Link to="/profile/update/change-password" className='passChangeBtn'>
                  <span> Change password <FaAngleRight/></span>
              </Link>
          </div>
        </div>
      </div>
      <div className="right redesign">
        <div className="updateTopBox">
          <div className="avatarBox">
              <img src={avatar || "/users/noavatar.jpg"} alt="avatar"/>
          </div>
          <div className="secondSide">
          <UploadWidget uwConfig={{
            cloudName : "JoelNiyo",
            uploadPreset: "Nextate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars"
          }}/>
          </div>
        </div>
      </div>
     </form>
    </section>
  )
}

export default Update
