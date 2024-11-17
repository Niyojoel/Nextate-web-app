import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/useContext';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import "./profileBtns.scss";
import apiRequest from '../../lib/apiRequest';


const ProfileBtns = ({handleLogout}) => {
  const {user, updateUser, updateLoading, showAlert} = useGlobalContext();
  const navigate = useNavigate();
  const dropDownref = useRef();
  const dropDownToggleRef = useRef();
  const dropIcon = useRef();

  const handleDelete = async()=> {
    try {
      const res = await apiRequest.delete(`/users/${user._id}`, "delete");
      const data = await res.data;
      showAlert(data.message, 'success');
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

  const showBtnsDrop = (e)=> {
    dropDownref.current.classList.toggle("activeDrop");
    dropIcon.current.classList.toggle('activeIcon');
    dropDownToggleRef.current.classList.toggle("unfold");
  }

  return (
    <div className="profilebtns"> 
        <button className='reg-profile profileDropdown' onClick={showBtnsDrop} ref={dropDownToggleRef}> <i className='icon' ref={dropIcon}><FaAngleDown /></i></button>
        <div className= "profileBtnsContainer" ref={dropDownref}>
          <ul className='prof_btns'>
              <li>
                <button className='dropdown-btn' onClick={handleLogout}>Logout</button>
              </li>
              <Link to="/profile/update">
                <button className='dropdown-btn'>Update Profile</button>
              </Link>
              <li>
                <button className='dropdown-btn' onClick={handleDelete}>Delete account</button>
              </li>
          </ul>
        </div>
    </div>
  )
}

export default ProfileBtns