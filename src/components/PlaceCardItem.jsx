import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { PHOTO_REF_URL } from '@/aimodels/Global';
import { GetPlaceDetails } from '@/aimodels/Global';

export default function PlaceCardItem({trip,partOfDay,idx,day,index}) {
  const itinerary = trip?.tripData?.itinerary;

  const[photoUrl,setPhotoUrl]=useState()

  useEffect(()=>{
    partOfDay&&GetPlacePhoto();
  
  },[partOfDay])
  
  
  
    const GetPlacePhoto=async()=>{
      
      const data={
        textQuery:itinerary[day][partOfDay]?.placeName
      }
  
      const result=await GetPlaceDetails(data).then(res=>{
        //console.log(res.data.places[0].photos[3].name);
  
        const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',res.data.places[0].photos[3].name);
        //console.log(PhotoUrl);
        setPhotoUrl(PhotoUrl)
      })
    }
  return (
  
  
      <div className='flex flex-col'>
      <Link to={'https://www.google.com/maps/search/?api=1&query='+itinerary[day][partOfDay]?.placeName+","+itinerary[day][partOfDay]?.placeDetails} target="_blank">
                  <div key={idx} className='flex flex-col shadow-md p-4 gap-4 rounded-xl border border-gray-200 hover:scale-105 transition-all hover:shadow-xl cursor-pointer'>
                    <h3 className="font-semibold capitalize">{partOfDay}</h3>
                    <div className="flex flex-col gap-2">
                      <img src={photoUrl?photoUrl:'/placeholder.jpg'} className='rounded-xl w-[130px] h-[130px] object-cover'/>
                      <h3 className="font-semibold">{itinerary[day][partOfDay]?.placeName}</h3>
                      <p>{itinerary[day][partOfDay]?.placeDetails}</p>
                    
                      <p className="text-xs">{itinerary[day][partOfDay]?.ticketPricing}</p>
                      <p className="text-xs font-bold text-red-500">{itinerary[day][partOfDay]?.timeTravel}</p>
                      <p className="text-md">🌟{itinerary[day][partOfDay]?.rating}</p>
                    {/* <Button className="w-10"><FaLocationDot /></Button> */}
                    </div>
                  </div>
                  </Link>
        
      </div>
    
  )
}
