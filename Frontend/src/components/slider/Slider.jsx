import React, { useState } from 'react';
import './slider.scss'
import { FaAngleLeft, FaAngleRight, FaTimes} from 'react-icons/fa';

const Slider = ({imgs}) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const changeSlide = (type)=> {
    if (type === 'left'){
      return setIndex(prev => {
        if(prev < 1) {
          return imgs.length - 1;
        }
        return prev - 1;
      })
    }  
    return setIndex(prev => {
      if(prev >= imgs.length - 1) {
        return 0;
      }
      return prev + 1;
    })
  }
   
  const displayFullImg = (showState, index)=> {
    setIndex(index);
    setOpen(showState);
  }

  return (
    <div className='slider'>
      {open &&
        <div className="fullSlider">
        <div className="arrow"><i onClick={()=>changeSlide('left')}><FaAngleLeft/></i></div>
        <div className="sliderImg">
          <img src={imgs[index]} alt="sliderImages" />
          {/* className='fullImg' */}
        </div>
        <div className="arrow"><i onClick={()=>changeSlide('right')}><FaAngleRight/></i></div>
        <div className="close" onClick={()=> setOpen(false)}><FaTimes/></div>
      </div>
      }
      
      <div className="big" >
        <img src={imgs[0]} alt="" className='img' onClick={()=>  displayFullImg(true , 0)}/>
      </div>
      <div className="small" >
        {imgs.slice(1).map((el, i)=> <img src= {el} alt= "img" key= {i}className='img' onClick={()=> displayFullImg(true, i+1)}/>
        )}
      </div>
    </div>
  )
}

export default Slider