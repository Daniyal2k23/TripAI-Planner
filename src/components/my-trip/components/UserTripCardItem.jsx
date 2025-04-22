import { GetPlaceDetails, PHOTO_REF_URL } from '@/aimodels/Global';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function UserTripCardItem({trip,index}) {
  const[photoUrl,setPhotoUrl]=useState()

  useEffect(()=>{
    trip&&GetPlacePhoto();
  
  },[trip])
  
  
  
    const GetPlacePhoto=async()=>{
      
      const data={
        textQuery:trip?.userSelection?.location?.label
      }
  
      const result=await GetPlaceDetails(data).then(res=>{
        console.log(res.data.places[0].photos[3].name);
  
        const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',res.data.places[0].photos[3].name);
        console.log(PhotoUrl);
        setPhotoUrl(PhotoUrl)
      })
    }
  return (
    <Link to={'/view-trip/'+trip?.id} className='cursor-pointer'>
    <div className='hover:scale-105 transition-all'>
      <img src={photoUrl?photoUrl:'/placeholder.jpg'} className="object-cover rounded-xl h-[220px]" />
      <div key={index}>
        <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
        <h2 className='font-md text-sm text-gray-500'>{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} Budget</h2>
      </div>
    </div>
    </Link>
  )
}
