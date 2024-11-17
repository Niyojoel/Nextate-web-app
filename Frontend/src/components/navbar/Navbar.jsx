import React, {useEffect, useRef, useState} from 'react';
import './navbar.scss';
import { Link, useResolvedPath } from 'react-router-dom';
import {AiOutlineMenu} from 'react-icons/ai'
import {Footer} from "../";
import {useGlobalContext} from '../../context/useContext';
import notifyStore from '../../lib/notifyStore.js';

const Navbar = () => {
const {expand, user, path} = useGlobalContext();

const fetch = notifyStore(state => state.fetch);
const count = notifyStore(state => state.count);

fetch();

const [open, setOpen] = useState(false);
const navLeftRef = useRef();

useEffect(()=> {
    Array.from(navLeftRef.current.children).slice(1).forEach((child)=> {
        child.classList.remove("active");
        child.href.split("/")[3] === path && child.classList.add("active");
    })
},[path])

  return (
    <nav className='nav'>
        <div className={`navleft ${expand ? "leftGrow" : undefined}`} ref={navLeftRef}> 
            <a href ='/' className='logo'>
                <img src="/logo.png" alt="nextate-logo"/>
                <span>Nextate</span>
            </a>
            <a href ='/' className='navmenus' >Home</a>
            <a href ='/list' className='navmenus' >Property</a>
            <a href ='/about' className='navmenus' >About</a>
            {/* <a href ='/contacts' className='navmenus' >Contacts</a> */}
            <a href ='/agents' className='navmenus' >Agents</a>
            
        </div>
        <div className={`navright transparent ${expand ? "rightShrink" : undefined}`}>
           {user ? (
           <div className='user'>
            <div className={`userInfo ${expand ? "crop" : undefined}`}>
                 <Link to="/profile" className='profileImg'>
                    <img src={user.avatar || "/users/noavatar.jpg"} alt="user_img" className='userImg'/>
                </Link>
                <span className={expand ? 'disappear' : undefined}>{user?.username}</span>
            </div>
            {count > 0 && <span className='notification'>{count}</span>}
            <Link to="/profile" className={`register ${expand ? "deflate" : undefined}`}> Profile </Link>
           </div>) 
           : (<> <a href ='/signin'>Sign in</a>
            <a href ='signup' className='register'>Sign up</a></>)}
            <button className={`menu_icon ${open ? 'colorChange' : undefined} `} onClick ={()=>setOpen(!open)}>
                <AiOutlineMenu/>
            </button>
            <div className={`menuOverlay ${open ? 'active' : undefined} `}>
                <div className= {`menus`}>
                    <a href ='/'>Home</a>
                    <a href ='/about'>About</a>
                    <a href ='/contacts'>Contacts</a>
                    <a href ='/agents'>Agents</a>
                    <a href ='/list'>Property</a>
                    <a href ='/signin'>Sign in</a>
                    <a href ='/signup'>Sign up</a>

                    <Footer bcgNone = "bcgNone"/>
                </div>
            </div>

        </div>
    </nav>
  )
}

export default Navbar