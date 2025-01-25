import React from 'react';
import "./pin.scss"
import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

const Pin = ({location}) => {
  return (
    <Marker position={[Number(location.latitude), Number(location.longitude)]}>
        <Popup>
            <div className="popup">
                <img src={location.images[0]} alt="location-image" />
                <div className="text">
                    <Link to ={`/${location.id}`}>{location.title} </Link>
                    <span>{location.bedrooms} bedroom</span>
                    <p>${location.price}</p>
                </div>
            </div>
        </Popup>
    </Marker>
  )
}

export default Pin
