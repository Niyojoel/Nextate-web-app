import React from 'react';
import "./features.scss";
import {v4 as uuidv4} from "uuid"

const Features = ({postData, fold, bcg}) => {

  const featuresIcon = ["./icons/bed.png", "./icons/bath.png"]
  
  const newFeat = [`${postData.bedroom} bedrooms`, `${postData.bathroom} bathrooms`]
  return (
    <div className={`features ${fold && 'fold'}`}>
        {newFeat.map((el, i)=> {
          return (
          <div className={`feature ${bcg}`} key={uuidv4()}>
            <img src={featuresIcon[i]} alt ="bed-icon" className='icon'/>
            <span>{el}</span>
          </div>
          )
        })}
    </div>
  )
}

export default Features