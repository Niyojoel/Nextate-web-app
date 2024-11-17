import React, { useEffect, useRef } from 'react';
import "./changePassword.scss"
import { FaAngleLeft, FaSpinner} from 'react-icons/fa6';
import {useGlobalContext} from '../../context/useContext';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../components';

const ChangePassword = () => {
  const {message, isLoading, passMatch, handleSubmit, showAlert, updateLoading, changeMade, setChangeMade} = useGlobalContext();
  const navigate = useNavigate();
  const currPasswordRef = useRef();

  const handleChange = (e)=> {
  e.target.value === currPasswordRef.current.value ? setChangeMade(false) : setChangeMade(true);
  }

  const processSubmit = async (e)=> {
    e.preventDefault();
    console.log(changeMade)
    if(changeMade === false) {
      return showAlert('Please choose a new password', 'fail', 2000)}
    try {
      const res = await handleSubmit(e, "/auth/change-password", "patch");
      const data = res.data;
      setTimeout(() => {
        showAlert(data.message, 'success', 1500);
      }, 1000);
      setTimeout(() => {
        navigate("/profile/update");
      }, 3000);
    } catch (err) {
      console.log(err)
      showAlert(err.response.data.message, 'fail');
    } finally {
      setTimeout(() => {
        updateLoading(false)
      }, 3000);
      setChangeMade(false);
    }
  }

  useEffect(()=> {return setChangeMade(false)}, [])

  return (
    <section className='container homeWrapper'>
      <div className="left">
        <div className="wrapper jc">
            <figure className='banner'><img src='/imgedit.png' alt="" /></figure>
            {message && <Alert/>}
            <div className="connectform">
                <h1>Change Password</h1>
                <form className='loginform' onSubmit={processSubmit}>
                    <div className="input">
                    <input type="password" id='currentPassword' name='currentPassword' placeholder='Current Password' required ref={currPasswordRef}/>
                    </div>
                    <div className="input">
                    <input type="password" id='password' name='password' placeholder='Password' className={passMatch === "fail" ? "unmatch" : undefined} onClick={handleChange} required/>
                    </div>
                    <div className="input">
                    <input type="password" id='confirmPassword' name="confirmPassword" placeholder='Confirm Password' className={passMatch === "fail" ? "unmatch" : undefined} onClick={handleChange} required/>
                    </div>
                    <button disabled={isLoading} className={changeMade === false ? "changeNotmade" : undefined}> {isLoading ? <FaSpinner/> : 'Submit'}</button>
                </form>
                <Link to="/profile/update" className='passChangeBtn'>
                    <span> <FaAngleLeft/> Back to update profile</span>
                </Link>
            </div>
        </div>
      </div>
    <div className="right homeRight">
        <img src="/imgedit.png" alt="banner_img"/>
    </div>
    </section>
  )
}

export default ChangePassword