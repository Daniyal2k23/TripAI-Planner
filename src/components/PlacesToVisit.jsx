import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { FaLocationDot } from "react-icons/fa6";
import { PHOTO_REF_URL } from '@/aimodels/Global';
import { GetPlaceDetails } from '@/aimodels/Global';
import PlaceCardItem from './PlaceCardItem';

export default function PlacesToVisit({ trip }) {
  const itinerary = trip?.tripData?.itinerary;



  return (
    <div className='flex flex-col gap-2'>
      <h2 className="font-bold text-xl mt-8">Places To Visit</h2>

      {/* Displaying itinerary data */}
      <div className='flex flex-col gap-2'>
        {itinerary &&
          Object.keys(itinerary)
            .sort((a, b) => {
              const dayA = parseInt(a.split('day')[1], 10);
              const dayB = parseInt(b.split('day')[1], 10);
              return dayA - dayB;
            })
            .map((day, index) => (
              <div key={index} className='flex flex-col my-3 gap-6'>
                <h2 className="font-bold text-lg capitalize">{day.replace('_', ' ')}</h2>
                <div className='flex gap-4'>
                {Object.keys(itinerary[day]).map((partOfDay, idx) => (
                <PlaceCardItem trip={trip} partOfDay={partOfDay} idx={idx} day={day} index={index} />
                ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
