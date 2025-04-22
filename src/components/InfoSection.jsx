import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { FiSend } from "react-icons/fi";
import { GetPlaceDetails } from '@/aimodels/Global';

import { PHOTO_REF_URL } from '@/aimodels/Global';

export default function InfoSection({trip}) {

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
    <div>
      <img src={photoUrl?photoUrl:'/placeholder.jpg'} className='h-[400px] w-full object-cover rounded-xl ' />

<div className='flex justify-between items-center'>
      <div className='my-5 flex flex-col gap-2'>
        <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label}</h2>
        <div className='flex gap-4'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🗓️ {trip?.userSelection?.noOfDays} - Days</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💵 {trip?.userSelection?.budget} Buget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🍷 No. Of Traveler: {trip?.userSelection?.noOfTraveler} </h2>
        </div>
      </div>
      <Button><FiSend /></Button>
      </div>
    </div>
  )
}
