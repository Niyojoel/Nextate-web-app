import React, { useState } from 'react';
import "./footer.scss"
import { FaFacebook, FaInstagram, FaPhone, FaTwitter } from 'react-icons/fa';

const Footer = ({bcgNone}) => {
    const [year, setYear]= useState(new Date().getFullYear());
  return (
    <footer className={`footer ${bcgNone}`}>
        <div className="footerLeft"> © Nextate <span>property</span>  {year}</div>
        <div className="footerRight">
            <div className="col socials">
            <div className="socialIcons">
                <FaFacebook/>
                <FaTwitter/>
                <FaInstagram/>
            </div>
            <p>Nextate Property</p>
            </div>
            <div className="col contact">
                <FaPhone/>
                994-234-7685
            </div>
        </div>
    </footer>
  )
}

export default Footer