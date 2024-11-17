import React from 'react';
import "./layout.scss";
import { Outlet } from 'react-router-dom';
import {Navbar, Footer} from '../../components';


const Layout = () => {

  return (
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

export default Layout;