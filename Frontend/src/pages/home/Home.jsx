import React from 'react';
import './home.scss'
import {Search} from '../../components';

const Home = () => {
  return (
    <section className='container homeWrapper'>
        <div className="left homeLeft">
          <div className='wrapper homeWrap'>
            <figure className='banner'><img src='./imgedit.png' alt="" /></figure>
            <div className="bannerText">
              <h1 className='title'>Find Real Estate,<br/> Get The Place of Your Dream </h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia facere voluptatum deserunt tempora dolore dicta vel assumenda doloremque, numquam similique.</p>
              <Search/>
              <div className="boxes">
                <div className="box">
                  <h1>16+</h1>
                  <h2>Years of Experience</h2>
                </div>
                <div className="box">
                  <h1>200</h1>
                  <h2>Awards Gained</h2>
                </div>
                <div className="box">
                  <h1>1500+</h1>
                  <h2>Property Ready</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right homeRight">
            <img src="/imgedit.png" alt="banner_img"/>
        </div>
    </section>
  )
}

export default Home