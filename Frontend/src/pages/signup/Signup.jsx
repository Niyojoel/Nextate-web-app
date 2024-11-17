import React, { useEffect, useRef, useState } from 'react';
import "./signup.scss";
import { Link, useNavigate } from 'react-router-dom';
import {Alert} from '../../components';
import { FaSpinner } from 'react-icons/fa6';
import {useGlobalContext} from '../../context/useContext';

const Signup = () => {
  const { message, isLoading, passMatch, updateLoading, showAlert, handleSubmit} = useGlobalContext();
  const navigate = useNavigate("")

  const processSubmit = async (e)=> {
    try {
      const res = await handleSubmit(e, '/auth/signup', "post");
      const data = await res.data;
      setTimeout(() => {
        showAlert(`${data.message}...`, 'success');
      }, 1000);
       setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      console.log(err)
      showAlert(err.response.data.message, 'fail');
    } finally {
      setTimeout(() => {
        updateLoading(false)
      }, 3000);
    }
  }

  return (
   <section className='container homeWrapper'>
      <div className="left">
        <div className="wrapper jc">
          <figure className='banner'><img src='./imgedit.png' alt="" /></figure>
          {message && <Alert message={message}/>}
          <div className="connectform">
              <h1>Create an Account</h1>
              <form className='loginform' onSubmit={processSubmit}>
                <div className="input">
                  <input required type="text" id='name' name='name' placeholder='Name'/>
                </div>
                <div className="input">
                  <input required type="email" id='email' name='email' placeholder='my@gmail.com'/>
                </div>
                <div className="input">
                  <input required type="tel" id='phone' name='phone' placeholder='+994 312 675' min={10} max={20}/>
                </div>
                <div className="input">
                  <input required type="text" id='country' name='country' placeholder='Country of Residence' min={10} max={20}/>
                </div>
                <div className="input">
                  <input required type="text" id='username' name='username' placeholder='Username'/>
                </div>
                <div className="input">
                  <input required type="password" id='password' name='password' placeholder='**********' min={8} max={30}  className={passMatch === "fail" ? "unmatch" : undefined}/>
                </div>
                <div className="input">
                  <input required type="password" id='confirmPassword'  name='confirmPassword' placeholder='**********' min={8} max={30} className={passMatch === "fail" ? "unmatch" : undefined}/>
                </div>
                <button disabled={isLoading}> {isLoading ? <FaSpinner/> : 'SignUp'}</button>
              </form>
              <Link to="/signin">Already existing account ? Click to sign in</Link>
          </div>
        </div>
      </div>
       <div className="right homeRight">
          <img src="/imgedit.png" alt="banner_img"/>
        </div>
    </section>
  )
}

export default Signup

