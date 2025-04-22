import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { PHOTO_REF_URL } from "@/aimodels/Global";
import { GetPlaceDetails } from '@/aimodels/Global';
export default function HotelCardItems({ hotel, index }) {

    const[photoUrl,setPhotoUrl]=useState()

useEffect(()=>{
  hotel&&GetPlacePhoto();

},[hotel])



  const GetPlacePhoto=async()=>{
    
    const data={
      textQuery:hotel?.HotelName
    }

    const result=await GetPlaceDetails(data).then(res=>{
      //console.log(res.data.places[0].photos[3].name);

      const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',res.data.places[0].photos[3].name);
      //console.log(PhotoUrl);
      setPhotoUrl(PhotoUrl)
    })
  }

  return (
    <div>
      <Link
        key={index}
        to={
          "https://www.google.com/maps/search/?api=1&query=" +
          hotel?.name +
          "," +
          hotel?.address
        }
        target="_blank"
      >
        <div className="my-2 flex flex-col gap-2 hover:scale-105 cursor-pointer transition-all">
          <img src={photoUrl?photoUrl:'/placeholder.jpg'} className="rounded-xl h-[200px] w-full object-cover" />

          <div>
            <h2 className="font-medium text-lg">{hotel?.HotelName}</h2>
            <p className="text-xs font-medium text-gray-600">
              📍 {hotel?.HotelAddress}
            </p>

            <p className="text-md font-semibold">💶 {hotel?.Price}</p>
            <p className="text-md">🌟 {hotel?.rating}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
