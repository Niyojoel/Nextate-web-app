import React from 'react';
import "./login.scss";
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../components';
import {useGlobalContext} from '../../context/useContext';
import { FaSpinner } from 'react-icons/fa';

const Login = () => {
  const { message, isLoading, updateUser, handleSubmit, showAlert, updateLoading} = useGlobalContext()
  const navigate = useNavigate("")

   const processSubmit = async (e)=> {
    try{
      const res = await handleSubmit(e, '/auth/login', "post");
      const data = await res.data;
      // console.log(data)
      setTimeout(() => {
        showAlert(`${data.message}...`, 'success');
      }, 1000);
      setTimeout(() => {
        navigate("/");
        updateUser(data.data);
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

  return (
    <section className='container homeWrapper'>
      <div className="left">
        <div className="wrapper jc">
          <figure className='banner'><img src='/imgedit.png' alt="" /></figure>
          {message && <Alert/>}
          <div className="connectform">
              <h1>Welcome Back</h1>
              <form className='loginform' onSubmit={processSubmit}>
                <div className="input">
                  <input type="email" id='email' name='email' placeholder='Email' required/>
                </div>
                <div className="input">
                  <input type="password" id='password' name='password' placeholder='**********' min={8} max={30} required/>
                </div>
                <button disabled={isLoading}> {isLoading ? <FaSpinner/> : 'Login'}</button>
              </form>
              <Link to="/signup">Click here to create an account</Link>
          </div>
        </div>
      </div>
       <div className="right homeRight">
          <img src="/imgedit.png" alt="banner_img"/>
        </div>
    </section>
  )
}

export default Login