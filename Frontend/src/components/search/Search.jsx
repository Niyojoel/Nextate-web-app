import React, {useRef, useState} from 'react';
import './search.scss'
import {} from 'react-icons/ai';
import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const types = ["All",'Buy','Rent']
const Search = () => {
    const[query, setQuery] = useState({
        type: 'All',
        city: "",
        minPrice: 0,
        maxPrice: 10000000,
    });
    const cityInputRef = useRef(null);

    const searchQuery = `type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`;

    const switchType = val => {
        cityInputRef.current.focus();
        setQuery(prev=> {
            return {...prev, type: val}
        })
    }

    const handleChange = (e)=> {
         setQuery(prev=> {
            return {...prev, [e.target.name] : e.target.value}
        });
    }

  return (
    <section className='search'>
        <div className='type'>
            {types.map((type, i) => {
                return (
                <button key = {i} onClick={()=> switchType(type)} className={`${query.type === type && 'active'} ${type === "All" && 'default'}`}>{type}</button>
            )
            })}
        </div>
        <form className='form'>
            <input type="text" name='city' id="city" placeholder ='City location' onChange={handleChange} defaultValue='' ref={cityInputRef} autoFocus/>
            <input type="number" name='minPrice' min={0} max={10000000} onChange={handleChange} placeholder='Min Price'/>
            <input type="number" name='maxPrice' min={0} max={10000000} onChange={handleChange} placeholder='Max Price'/>
            <Link to={`/list?${searchQuery}`}><button> <i> <FaSearch/> </i> </button></Link>
        </form>
    </section>
  )
}

export default Search