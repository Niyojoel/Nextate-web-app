import React, { useEffect, useState } from 'react';
import "./addpost.scss";
import { FaAngleLeft, FaAngleRight, FaSpinner } from 'react-icons/fa6';
import {useGlobalContext} from '../../context/useContext';
import { useNavigate, useResolvedPath } from 'react-router-dom';
import { Alert, UploadWidget } from '../../components';

const Addpost = () => {
    const {setExpand, expand, isLoading, message, imgPrev, setImgPrev,  showAlert, handleSubmit, updateLoading, getPath} = useGlobalContext();
    const navigate= useNavigate()

    const {pathname} = useResolvedPath()
    const path = pathname.split("/")[2]
    const [screenSize, setScreenSize] = useState(window.innerWidth < 1100 ? "small" : "large")

  const processSubmit = async (e)=>{ 
    console.log("about to submit")
    try{
      const res = await handleSubmit(e, '/posts', "post");
      const data = await res.data;
      console.log(data)
      setTimeout(() => {
        showAlert(data.message, 'success', 1500);
      }, 1000);
      setTimeout(() => {
        navigate("/"+ data.data._id);
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

  useEffect(()=> {
    setImgPrev([]);
    getPath(path);
    const changeScreenSize = ()=> window.innerWidth < 1100 ? setScreenSize("small") : setScreenSize("large");
    window.addEventListener('resize', changeScreenSize)
  
    return ()=> window.removeEventListener('resize', changeScreenSize)
  }, [])

  console.log(imgPrev)
//   console.log(screenSize);

  return (
    <main className='container changeFlex page_nav-gap' style={{position: "relative"}}>
        <form className='mainForm' onSubmit={processSubmit}>
            <div className={`left spanMajority ${expand ? 'profileLeft' : undefined}`}>
                <button type="button" className={`resizeLeft ${expand && 'adjust'}`} onClick={()=>setExpand(!expand)}>
                    {!expand && <i className='icon'><FaAngleRight/></i>}
                    {expand && <i className='icon'><FaAngleLeft/></i>}
                </button>
                <div className="wrapper jc coverSticky">
                {message && <Alert/>}
                <div className="connectform addPost">
                    <h1>Add New Post</h1>
                    <div className='loginform addPost2' id="postForm">
                        <div className="input titleHead">
                            <span className='span'>
                                <label htmlFor="title">Title</label>
                                <input type="text" id='title' required name='title' autoFocus/>
                            </span>
                        </div>
                        <div className="input location">
                            <span className='span'>
                                <label htmlFor="address">Address</label>
                                <input type="text" id='address' name= "address" required/>
                            </span>
                            <span className='span coordinate latnoxs'>
                                <label htmlFor="latitude">Latitude</label>
                                <input type="text" id='latitude' name='latitude' placeholder='-12.5823' required/>
                            </span>
                        </div>
                        <div className="input location2">
                            <span className='span flexTwo'>
                                <label htmlFor="city">City </label>
                                <input type="text" id='city' name='city' required/>
                            </span>
                            <span className='span flexTwo'>
                                <label htmlFor="country">Country</label>
                                <input type="text" id='country' name='country' required/>
                            </span>
                            <span className='span coordinate latyesxs'>
                                <label htmlFor="latitude">Latitude</label>
                                <input type="text" id='latitude' name='latitude' placeholder='-12.5823' required/>
                            </span>
                            <span className='span coordinate'>
                                <label htmlFor="longitude">Longitude</label>
                                <input type="text" id='longitude' name='longitude' placeholder='56.89' required/>
                            </span>
                        </div>
                        <div className="input desc">
                            <span className='span'>
                                <label htmlFor="desc">Description</label>
                                <textarea name="desc" id="desc" cols="30" rows="10"></textarea>
                            </span>
                            {/* <ReactQuill theme='snow' onChange={(e)=>setValue(e.target.value)} value={value}/> */}
                        </div>
                        <div className="input type">
                            <span className='span'>
                                <label htmlFor="property">Property</label>
                                <select name="property" id="property">
                                    <option value="apartment">Apartment</option>
                                    <option value="condo">Condo</option>
                                    <option value="house">House</option>
                                    <option value="land">Land</option>
                                </select>
                            </span>
                            <span className='span'>
                                <label htmlFor="type">Type</label>
                                <select name="type" id="type">
                                    <option value="buy">Buy</option>
                                    <option value="rent">Rent</option>
                                </select>
                            </span>
                            <span className='span'>
                                <label htmlFor="price">Price</label>
                                <input type="number" id='price' name='price' required/>
                            </span>
                            {/* those to show on extra small device */}
                            <span className='span latyesxs'>
                                <label htmlFor="size">Total size (sqft)</label>
                                <input type="number" name="size" id="size" min={0}  placeholder=''/>
                            </span>
                            <span className='span latyesxs'>
                                <label htmlFor="bedroom">Bedrooms</label>
                                <input type="number" id='bedroom' name='bedroom' min={0} required/>
                            </span>
                            <span className='span latyesxs'>
                                <label htmlFor="bathroom">Bathrooms</label>
                                <input type="number" id='bathroom' name='bathroom' min={0}/>
                            </span>
                            <span className='span latyesxs'>
                                <label htmlFor="utilities" className='cropLabel'>Utilities Responsibility</label>
                                <select name="utilities" id="utilities">
                                    <option value="owner">Owner's</option>
                                    <option value="tenant">Tenant's</option>
                                </select>
                            </span>
                            <span className='span latyesxs'>
                                <label htmlFor="pets">Pets Policy</label>
                                <select name="pets" id="pets">
                                    <option value="allowed">Allowed</option>
                                    <option value="not allowed">Not allowed</option>
                                </select>
                            </span>
                            <span className='span latyesxs'>
                                <label htmlFor="income">Income Policy</label>
                                <input type="text" name="income" id="income" placeholder='Income requirement'/>
                            </span>
                        </div>
                        <div className="input size noxs">
                        <span className='span'>
                                <label htmlFor="size">Total size (sqft)</label>
                                <input type="number" name="size" id="size" min={0}  placeholder=''/>
                            </span>
                            <span className='span'>
                                <label htmlFor="bedroom">Bedrooms</label>
                                <input type="number" id='bedroom' name='bedroom' min={0} required/>
                            </span>
                            <span className='span'>
                                <label htmlFor="bathroom">Bathrooms</label>
                                <input type="number" id='bathroom' name='bathroom' min={0}/>
                            </span>
                        </div>
                        <div className="input policy noxs">
                            <span className='span'>
                                <label htmlFor="income">Income Policy</label>
                                <input type="text" name="income" id="income" placeholder='Income requirement'/>
                            </span>
                            <span className='span'>
                                <label htmlFor="utilities" className='cropLabel'>Utilities Responsibility</label>
                                <select name="utilities" id="utilities">
                                    <option value="owner">Owner's</option>
                                    <option value="tenant">Tenant's</option>
                                </select>
                            </span>
                            <span className='span'>
                                <label htmlFor="pets">Pets Policy</label>
                                <select name="pets" id="pets">
                                    <option value="allowed">Allowed</option>
                                    <option value="not allowed">Not allowed</option>
                                </select>
                            </span>
                        </div>
                        <p>Nearby facilities & distance away (m)</p> 
                        <div className="input distances">
                            <div className="firstrow">
                                <span className='span'>
                                <label htmlFor="school">School </label>
                                <input type="number" name="school" id="school" min={0} placeholder='200m' className='restrictInput'/>
                                </span>
                                <span className='span'>
                                    <label htmlFor="bus"> Bus </label>
                                    <input type="number" name="bus" id="bus" min={0} placeholder='50m' className='restrictInput'/>
                                </span>
                                <span className='span latnoxs'>
                                    <label htmlFor="restaurant">Restaurant</label>
                                    <input type="number" name="restaurant" id="restaurant" min={0} placeholder='100m' className='restrictInput'/>
                                </span>
                            </div>
                            <div className="firstrow">
                                <span className='span'>
                                    <label htmlFor="mall">Mall</label>
                                    <input type="number" name="mall" id="mall" min={0} placeholder='150m' className='restrictInput'/>
                                </span>
                                <span className='span'>
                                    <label htmlFor="church">Church</label>
                                    <input type="number" name="church" id="church" min={0} placeholder='500m' className='restrictInput'/>
                                </span>
                                <span className='span latnoxs'>
                                    <label htmlFor="gym">Gym</label>
                                    <input type="number" name="gym" id="gym" min={0} placeholder='230m' className='restrictInput'/>
                                </span>
                            </div>
                            <div className="firstrow showrowonxs">
                                <span className='span'>
                                    <label htmlFor="restaurant">Restaurant</label>
                                    <input type="number" name="restaurant" id="restaurant" min={0} placeholder='100m' className='restrictInput'/>
                                </span>
                                <span className='span'>
                                    <label htmlFor="gym">Gym</label>
                                    <input type="number" name="gym" id="gym" min={0} placeholder='230m' className='restrictInput'/>
                                </span>
                            </div>
                        </div>
                        { screenSize === "large" && (
                        <button type="submit" disabled={isLoading}> 
                            {/*form='postForm'*/}
                            {isLoading ? <FaSpinner/> : 'Add Post'}
                        </button>) }
                    </div>
                    {/* { screenSize === "large" && (
                    <button type="submit" form='postForm' disabled={isLoading}> 
                        {isLoading ? <FaSpinner/> : 'Add Post'}
                    </button>) } */}
                </div>
                </div>
            </div>
            <div className={`right redesign contentRight ${expand && 'profileRight'}`}>
                <div className="featuredImgs">
                    <p className='imgsHeader'>
                        Featured Images
                    </p>
                    <figure className="imagesBox"> 
                        <div className="topImgSm">
                            <span>{imgPrev[0] && <img src={imgPrev[0]} alt="" />}</span>
                            <span>{imgPrev[1] && <img src={imgPrev[1]} alt="" />}</span>
                        </div>
                        <div className="topImgSm">
                            <span>{imgPrev[2] && <img src={imgPrev[2]} alt="" />}</span>
                            <span>{imgPrev[3] && <img src={imgPrev[3]} alt="" />}</span>
                        </div>
                    </figure>
                    <UploadWidget uwConfig={{
                        cloudName : "JoelNiyo",
                        uploadPreset: "Nextate",
                        multiple: true,
                        maxImageFileSize: 2000000,
                        folder: "posts"
                    }}/>
                </div>
                { screenSize === "small" && (<div className="btnBox">
                    <button type="submit" className='addBtnMd' disabled={isLoading}>
                        {/*form='postForm'*/} 
                        {isLoading ? <FaSpinner/> : 'Add'}
                    </button>
                </div>)}
            </div>
        </form>
    </main>
  )
}

export default Addpost
