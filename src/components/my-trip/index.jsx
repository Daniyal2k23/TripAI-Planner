import { collection,query,where,getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { db } from '@/aimodels/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';

export default function MyTrip() {
    const navigate=useNavigate();
    const [userTrips,setUserTrips]=useState([])
    useEffect(()=>{
     GetUserTrips();
    },[])


    const GetUserTrips=async()=>{
        const user=JSON.parse(localStorage.getItem('user'));
        console.log(user)
       

        if(!user){
            navigate('/');
            return;
        }
     

        const q=query(collection(db,'generatedtripdata'),where('userEmail','==',user?.email));
       
        const querySnapshot = await getDocs(q);
        setUserTrips([]);
         querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    setUserTrips(prevVal=>[...prevVal,doc.data()])
});
    }
  return (
    <div className='flex flex-col w-full justify-between gap-8 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 mb-8'>
     <h2 className='font-bold text-3xl'>My Trips 🧗🏽🪂</h2>
     <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
        {userTrips?.length>0?userTrips.map((trip,index)=>(
            <UserTripCardItem trip={trip} index={index} />
        )) 
        //its called skeleton effect
      :[1,2,3,4,5,6].map((item,index)=>(
        <div key={index} className='h-[220px] w-full bg-slate-300 animate-pulse rounded-xl'> 
        
        </div>
      ))
      
      }
     </div>
    </div>
  )
}
