import React, { useEffect, useState } from 'react';
import "../addpost/addpost.scss";
import { FaAngleLeft, FaAngleRight, FaSpinner } from 'react-icons/fa6';
import {useGlobalContext} from '../../context/useContext';
import { useLoaderData, useNavigate, useResolvedPath } from 'react-router-dom';
import { Alert, UploadWidget } from '../../components';

const Editpost = () => {
    const {setExpand, expand, isLoading, changeMade, message, imgPrev, setImgPrev, showAlert, handleSubmit, setChangeMade, updateLoading, getPath} = useGlobalContext();
    const navigate= useNavigate()
    const res = useLoaderData();
    const post = res.data;

    const {pathname} = useResolvedPath()

    const path = pathname.split("/")[2];

    const {postDetail} = post;

    const handleChange = (e)=> {
       e.target.value === e.target.defaultValue ? setChangeMade(false) : setChangeMade(true);
    };

  const processSubmit = async (e)=>{ 
    console.log('editing initiated');
    try{
      const res = await handleSubmit(e, `/posts/${post._id}`, "patch");
      const data = await res.data;
      console.log(data)
      setTimeout(() => {
        showAlert(data.message, 'success', 1500);
      }, 1000);
      setTimeout(() => {
        setChangeMade(false)
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
  };


  useEffect(()=> {
    setImgPrev (post.images);
  }, [post]); //--try an empty dependency

  useEffect(()=> {
    imgPrev === post.images ? setChangeMade(false) : setChangeMade(true);
  }, [imgPrev]);

  useEffect(()=> {
      getPath(path);
    }, []);

    console.log(imgPrev);

  return (
    <section className='container changeFlex'>
     <form className='mainForm' onSubmit={processSubmit}>
      <div className={`left spanMajority ${expand ? 'profileLeft' : undefined}`}>
        <button className={`resizeLeft ${expand && 'adjust'}`} onClick={()=>setExpand(!expand)}>
            {!expand && <i className='icon'><FaAngleRight/></i>}
            {expand && <i className='icon'><FaAngleLeft/></i>}
          </button>
        <div className="wrapper jc coverSticky">
          {message && <Alert/>}
          <div className="connectform addPost">
              <h1>Edit Post</h1>
              <div className='loginform addPost2'>
                <div className="input titleHead">
                    <span className='span'>
                        <label htmlFor="title">Title</label>
                        <input onChange={handleChange} type="text" id='title' required name='title' defaultValue={post.title} autoFocus/>
                    </span>
                </div>
                <div className="input location">
                    <span className='span'>
                        <label htmlFor="address">Address</label>
                        <input onChange={handleChange} type="text" id='address' name= "address" defaultValue={post.address} required/>
                    </span>
                    <span className='span coordinate'>
                        <label htmlFor="latitude">Latitude</label>
                        <input onChange={handleChange} type="text" id='latitude' name='latitude' placeholder='-12.5823' defaultValue={post.latitude} required/>
                    </span>
                </div>
                <div className="input location2">
                    <span className='span flexTwo'>
                        <label htmlFor="city">City </label>
                        <input onChange={handleChange} type="text" id='city' name='city' defaultValue={post.city} required/>
                    </span>
                     <span className='span flexTwo'>
                        <label htmlFor="country">Country</label>
                        <input onChange={handleChange}type="text" id='country' name='country' defaultValue={postDetail.country} required/>
                    </span>
                    <span className='span coordinate'>
                        <label htmlFor="longitude">Longitude</label>
                        <input onChange={handleChange} type="text" id='longitude' name='longitude' placeholder='56.89' defaultValue={post.longitude} required/>
                    </span>
                </div>
                <div className="input desc">
                    <span className='span'>
                        <label htmlFor="desc">Description</label>
                        <textarea name="desc" id="desc" cols="30" rows="10" defaultValue={postDetail.desc}></textarea>
                    </span>
                </div>
                <div className="input type">
                    <span className='span'>
                        <label htmlFor="property">Property</label>
                        <select name="property" id="property" defaultValue={post.property}>
                            <option value="apartment">Apartment</option>
                            <option value="condo">Condo</option>
                            <option value="house">House</option>
                            <option value="land">Land</option>
                        </select>
                    </span>
                    <span className='span'>
                        <label htmlFor="type">Type</label>
                        <select name="type" id="type" defaultValue={post.type}>
                            <option value="buy">Buy</option>
                            <option value="rent">Rent</option>
                        </select>
                    </span>
                    <span className='span'>
                        <label htmlFor="price">Price</label>
                        <input onChange={handleChange} type="number" id='price' name='price'  defaultValue={post.price} required/>
                    </span>
                    <span className='span showonxs'>
                        <label htmlFor="size">Total size (sqft)</label>
                        <input onChange={handleChange} type="number" name="size" id="size" min={0} defaultValue={postDetail.size} placeholder='1200'/>
                    </span>
                    <span className='span showonxs'>
                        <label htmlFor="bedroom">Bedrooms</label>
                        <input onChange={handleChange}type="number" id='bedroom' name='bedroom' min={0}  defaultValue={post.bedroom} required/>
                    </span>
                    <span className='span showonxs'>
                        <label htmlFor="bathroom">Bathrooms</label>
                        <input onChange={handleChange}type="number" id='bathroom' name='bathroom'  defaultValue={post.bathroom} min={0}/>
                    </span>
                    <span className='span showonxs'>
                        <label htmlFor="utilities" className='cropLabel'>Utilities Responsibility</label>
                        <select name="utilities" id="utilities" defaultValue={postDetail.utilities}>
                            <option value="owner">Owner's</option>
                            <option value="tenant">Tenant's</option>
                        </select>
                    </span>
                    <span className='span showonxs'>
                        <label htmlFor="pets">Pets Policy</label>
                        <select name="pets" id="pets" defaultValue={postDetail.pet}>
                            <option value="allowed">Allowed</option>
                            <option value="not allowed">Not allowed</option>
                        </select>
                    </span>
                    <span className='span showonxs'>
                        <label htmlFor="income">Income Policy</label>
                        <input onChange={handleChange}type="text" name="income" id="income"  defaultValue={postDetail.income} placeholder='Income requirement'/>
                    </span>
                </div>
                <div className="input size hidexs">
                   <span className='span'>
                        <label htmlFor="size">Total size (sqft)</label>
                        <input onChange={handleChange} type="number" name="size" id="size" min={0} defaultValue={postDetail.size} placeholder='1200'/>
                    </span>
                    <span className='span'>
                        <label htmlFor="bedroom">Bedrooms</label>
                        <input onChange={handleChange}type="number" id='bedroom' name='bedroom' min={0}  defaultValue={post.bedroom} required/>
                    </span>
                    <span className='span'>
                        <label htmlFor="bathroom">Bathrooms</label>
                        <input onChange={handleChange}type="number" id='bathroom' name='bathroom'  defaultValue={post.bathroom} min={0}/>
                    </span>
                </div>
                <div className="input policy hidexs">
                    <span className='span'>
                        <label htmlFor="income">Income Policy</label>
                        <input onChange={handleChange}type="text" name="income" id="income"  defaultValue={postDetail.income} placeholder='Income requirement'/>
                    </span>
                    <span className='span'>
                        <label htmlFor="utilities" className='cropLabel'>Utilities Responsibility</label>
                        <select name="utilities" id="utilities" defaultValue={postDetail.utilities}>
                            <option value="owner">Owner's</option>
                            <option value="tenant">Tenant's</option>
                        </select>
                    </span>
                    <span className='span'>
                        <label htmlFor="pets">Pets Policy</label>
                        <select name="pets" id="pets" defaultValue={postDetail.pet}>
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
                        <input onChange={handleChange}type="number" className='restrictInput' name="school" id="school" min={0}  defaultValue={postDetail.school} placeholder='200m' />
                        </span>
                        <span className='span'>
                            <label htmlFor="bus"> Bus Station</label>
                            <input onChange={handleChange} type="number" name="bus" id="bus" min={0} placeholder='50m' defaultValue={postDetail.bus} className='restrictInput'/>
                        </span>
                        <span className='span hideonxs'>
                            <label htmlFor="restaurant">Restaurant</label>
                            <input onChange={handleChange} type="number" name="restaurant" id="restaurant" min={0} defaultValue= {postDetail.restaurant} placeholder='100m' className='restrictInput'/>
                        </span>
                     </div>
                     <div className="firstrow">
                        <span className='span'>
                            <label htmlFor="mall">Mall</label>
                            <input onChange={handleChange} type="number" name="mall" id="mall" min={0} placeholder='150m' defaultValue= {postDetail.mall} className='restrictInput'/>
                        </span>
                        <span className='span'>
                            <label htmlFor="church">Church</label>
                            <input onChange={handleChange} type="number" name="church" id="church" min={0} placeholder='500m' defaultValue={postDetail.church} className='restrictInput'/>
                        </span>
                        <span className='span hideonxs'>
                            <label htmlFor="gym">Gym</label>
                            <input onChange={handleChange}type="number" name="gym" id="gym" min={0} placeholder='230m'  defaultValue={postDetail.gym} className='restrictInput'/>
                        </span>
                     </div>
                     <div className="firstrow showonxs">
                        <span className='span'>
                            <label htmlFor="restaurant">Restaurant</label>
                            <input onChange={handleChange} type="number" name="restaurant" id="restaurant" min={0} defaultValue= {postDetail.restaurant} placeholder='100m' className='restrictInput'/>
                        </span>
                        <span className='span'>
                            <label htmlFor="gym">Gym</label>
                            <input onChange={handleChange}type="number" name="gym" id="gym" min={0} placeholder='230m'  defaultValue={postDetail.gym} className='restrictInput'/>
                        </span>
                     </div>
                </div>
                <button type= 'submit' className={changeMade === false ? "addBtn changeNotmade" : "addBtn"} disabled={isLoading}> 
                    {isLoading ? <FaSpinner/> : 'Edit Post'}
                </button>
              </div>
          </div>
        </div>
      </div>
       <div className={`right redesign ${expand && 'profileRight'}`}>
            <div className="featuredImgs">
              <p className='featuredImg'>Featured Images</p>
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
            </div>
            <div className="btnBox">
                <button type= 'submit' className='addBtnMd' disabled={isLoading}> 
                    {isLoading ? <FaSpinner/> : 'Edit'}
                </button>
            </div>
        </div>
      </form>
      <div className="uploadPhotoBtn">
         <UploadWidget uwConfig={{
            cloudName : "JoelNiyo",
            uploadPreset: "Nextate",
            multiple: true,
            maxImageFileSize: 2000000,
            folder: "posts"
         }}/>
      </div>
    </section>
  )
}

export default Editpost
