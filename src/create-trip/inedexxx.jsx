import React,{useEffect, useState} from 'react'

import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, BudgetData, TravelPartnerData } from '@/Datas/data';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/aimodels/AIModal';




import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';






export default function CreateTrip() {

  const [place, setPlace] = useState();
  const[formData, setFormData] = useState([]);
  const[openDialog, setOpenDialog] = useState(false);
  const handleInput =(name, value)=>{
  
    setFormData({
      ...formData,
      [name]:value
    })
  }

useEffect(()=>{
console.log(formData);
},[formData]);

const login=useGoogleLogin({
  onSuccess:(codeResp)=>GetUserProfile(codeResp),
  onError:(error)=>console.log(error)
})

const OngenerateTrip = async() =>{

const user=localStorage.getItem('user');

if(!user){
  setOpenDialog(true)
  return;
}


  if(formData?.noOfDays>20&&!formData?.location||!formData?.budget||!formData?.noOfTraveler){
    toast("Your data is empty just like your life!! 🕺🏼")
    return;
  }

const FINAL_PROMPT=AI_PROMPT
.replace('{location}', formData?.location?.label)
.replace('{totalDays}', formData?.noOfDays)
.replace('{traveler}',formData?.noOfTraveler)
.replace('{budget}',formData?.budget)

console.log(FINAL_PROMPT);

const result= await chatSession.sendMessage(FINAL_PROMPT)

console.log(result?.response?.text())

}

const GetUserProfile = (tokenInfo) =>{
  axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`,{
    headers:{
      Authorization:`Bearer ${tokenInfo?.access_token}`,
      Accept:'Application/json'
    }
  }).then((resp)=>{
    console.log(resp);
  })
}

  return (
    <div className='h-screen sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell Us your travel prefererence</h2>
       <p className='mt-3 text-gray-500 text-xl'>just provide some info bro</p>
    
    <div className='mt-20 flex flex-col gap-12'>
        <div>
          <h2 className='text-xl my-3 font-medium'>Choose any Destination ?</h2>
        
        <GooglePlacesAutocomplete 
        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
        selectProps={{
          place,
          onChange:(v)=>{setPlace(v); handleInput('location',v)}
        }}
        
        />
        
        </div>

        <div>
        <h2 className='text-xl my-3 font-medium'>For how many days ?</h2>
        <Input placeholder="Ex. 2" type="number"
        onChange={(e)=> handleInput('noOfDays', e.target.value)} />

        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>
            Let us know your budget for this trip.
          </h2>
          <p>This way we can suggest you the exact trip which is wallet-friendly to you.</p>
         
          <div className='flex justify-between gap-8'>
           {BudgetData.map((item,index)=>(
            <div key={index}
            onClick={()=>handleInput('budget',item.title)} 
            className={`mt-12 border rounded-md p-6 
            hover:shadow-lg cursor-pointer
            ${formData?.budget==item.title&&'shadow-lg border-black'}`}>
             <h2 className='text-4xl'>{item.icon}</h2>
             <h2 className='text-xl font-semibold'>{item.title}</h2>
             <h2 className='font-normal'>{item.desc}</h2>
            </div>
           ))}
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>
            How are you travelling?
          </h2>
          
         
          <div className='flex justify-between gap-8'>
           {TravelPartnerData.map((item,index)=>(
            <div key={index} 
            onClick={()=>handleInput('noOfTraveler',item.people)} 
            className={`mt-12 border rounded-md p-6 
            hover:shadow-lg cursor-pointer
             ${formData?.noOfTraveler==item.people&&'shadow-lg border-black'}`}>
             <h2 className='text-4xl'>{item.icon}</h2>
             <h2 className='text-xl font-semibold'>{item.title}</h2>
             <h2 className='font-normal'>{item.desc}</h2>
            </div>
           ))}
          </div>
        </div>

    </div>
    <div>
    <Button onClick={OngenerateTrip}>Generate a trip</Button>
    </div>
    
   
    <Dialog open={openDialog}>

  <DialogContent>
    <DialogHeader>
      
      <DialogDescription>
        <img src="./logo.svg" />
        <h2>Sign in with google</h2>
        <p>sign in securely</p>

        <Button onClick={login} className="w-full mt-5 flex gap-4 items-center"><FcGoogle className='h-7 w-7' />Sign In with Google </Button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}
