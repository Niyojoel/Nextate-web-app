import React, { useEffect, useRef, useState } from 'react';
import './filter.scss';
import { FaSearch } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeRef = useRef();
  const propertyRef = useRef();
  const minPriceRef = useRef();
  const maxPriceRef = useRef();
  const bedroomRef = useRef();


  const getQueryValues = (params = searchParams) => {
    return {
      type: params.get("type") || "",
      city: params.get("city") || "",
      property: params.get("property") || "",
      minPrice: params.get("minPrice") || 0,
      maxPrice: params.get("maxPrice") || 10000000,
      bedroom: params.get("bedroom") || 1,
    }
  }
  
  const [query, setQuery] = useState(getQueryValues());

  const handleChange = (e)=> {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    })
  }

  const handleFilter = ()=> {
    setSearchParams(query);
  }

  return (
    <search className ="filter">
      <h1>Search results for <b>{(searchParams.get("city") !== " " ? searchParams.get("city") : "All") || "All"}</b></h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input type="text" id='city' name='city' placeholder='City Location' defaultValue={query.city} onChange={handleChange}/>
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select name="type" id="type" defaultValue={query.type} onChange={handleChange} ref={typeRef}>
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select name="property" id="property" defaultValue={query.property} onChange={handleChange} ref={propertyRef}>
            <option value="" className='opt'>Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min price</label>
          <input type="number" id='minPrice' name='minPrice' defaultValue={query.minPrice} placeholder='Any' onChange={handleChange} ref={minPriceRef}/>
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max price</label>
          <input type="number" id='maxPrice' name='maxPrice' defaultValue={query.maxPrice} placeholder='Any' onChange={handleChange} ref={maxPriceRef}/>
        </div>
        <div className="item">
          <label htmlFor="bedroom">Bedroom(s)</label>
          <input type="number" id='bedroom' name='bedroom' defaultValue={query.bedroom} placeholder='Any' onChange={handleChange} ref={bedroomRef}/>
        </div>
      </div>
      <button onClick={handleFilter}> <i> <FaSearch/> </i></button>
    </search>
  )
}

export default Filter