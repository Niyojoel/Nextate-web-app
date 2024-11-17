import React, { useEffect, useRef } from 'react';
import "./alert.scss";
import {useGlobalContext} from "../../context/useContext";

const Alert = () => {
  const {message} = useGlobalContext();
  const alertRef = useRef()

  // console.log(message)


  useEffect(()=>{
    message?.type !== " " ? alertRef.current.classList.add("show") : alertRef.current.classList.remove("show")
  },[message])
  return (
    <div className='alert' ref={alertRef}>
        <p className={`${message?.type === 'success' ? "green" : "red"}`}>{message?.content}</p>
    </div>
  )
}

export default Alert;