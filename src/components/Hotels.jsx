import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItems from './HotelCardItems'

export default function Hotels({trip}) {
  return (
    <div>
        <h2 className='font-bold mt-4 mb-4 text-xl'>Hotel Recommendation</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        
        {trip?.tripData?.hotels?.map((hotel,index)=>(
      <HotelCardItems hotel={hotel} index={index}/>
           
        
    ))}
        
    
      </div>
    </div>
  )
}
