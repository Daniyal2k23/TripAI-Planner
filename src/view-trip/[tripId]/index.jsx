import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '@/aimodels/firebaseConfig';
import InfoSection from '@/components/InfoSection';
import Hotels from '@/components/Hotels';
import PlacesToVisit from '@/components/PlacesToVisit';

export default function ViewTrip() {
    const { tripId } = useParams();
    const[trip,setTrip]=useState([])




    useEffect(()=>{
        tripId&&GetTripData();
    },[tripId])

    const GetTripData=async()=>{
        const docRef=doc(db,'generatedtripdata',tripId);
        const docData = await getDoc(docRef);
        

        if(docData.exists()){
            console.log("documents data:", docData.data())
            setTrip(docData.data());
        }
        else{
            console.log("No such data");
        }

    }
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/*info section data*/}
      <InfoSection trip={trip} />
      <Hotels trip={trip} />
      <PlacesToVisit trip={trip}/>
    </div>
  )
}
