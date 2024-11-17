import React from 'react';
import "./layout.scss";
import { Navigate, Outlet } from 'react-router-dom';
import {Navbar, Footer} from '../../components';
import { useGlobalContext } from '../../context/useContext';

const RequireAuth = () => {
  const {user} = useGlobalContext()
  return (
    !user ? <Navigate to="/signin"/> :
    <main className="layout">
      <div className='navbar'>
        <Navbar/>
      </div>
      <div className='page'>
        <Outlet/>
        <Footer/>
      </div>
    </main>
  )
}

export default RequireAuth;