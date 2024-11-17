import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import './map.scss'
import {Pin} from '../';

const Map = ({locations}) => {

  let latsAggregate = 0;
  locations.forEach((place)=> latsAggregate += Number(place.latitude));
  const latsAverage = latsAggregate/locations.length;

  let longsAggregate = 0;
  locations.forEach((place)=> longsAggregate += Number(place.longitude));
  const longsAverage = longsAggregate/locations.length;

  const center = [parseFloat(latsAverage.toFixed(4)), parseFloat(longsAverage.toFixed(4))];

  const position = center || [8.0156, 6.8532];
    
  return (
    <MapContainer key= {position[0]} center={position} zoom={3} scrollWheelZoom={false} className='map'>
        <TileLayer attribution='<a href="https://www.openstreetmao.org/copyright"><a/>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((el, i) => {
            return <Pin key={el.latitude + i} location={el}/>
        })}
    </MapContainer>
  )
}

export default Map