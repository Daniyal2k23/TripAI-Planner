import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'


export default function Hero() {
  return (
    <div className='flex flex-col items-center justify-center mt-36 gap-6'>
      <h2 className='text-center font-extrabold text-[35px] lg:text-[55px] text-gray-800 tracking-tighter'>AI Trip Planner for your</h2>
       <h2 className='text-[35px] lg:text-[55px] font-extrabold -mt-8 text-gray-800 tracking-tighter'> personalized itenaries.</h2>
           <p className='text-sm lg:text-lg text-center text-gray-600'>Plan your next trip with an AI and never miss a place again.</p>
          
          <Link to={'/create-trip'}> <Button className="bg-yellow-500 border border-gray-600 hover:scale-110 hover:bg-yellow-300 p-6 w-64 text-gray-800 text-md">🚀 Get Started.</Button></Link>
    </div>
  )
}
