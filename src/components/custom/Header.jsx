import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";


export default function Header() {
const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(user?.picture);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.error("Login Error:", error),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      window.location.reload();
  
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast("Failed to fetch user profile. Please try again.");
    }
  };

  return (
    <div className="p-3 flex justify-between shadow-sm items-center px-5">
      <div className="flex items-center gap-2">
      {/*<img src="/logo.svg" /> */}
    <a href="/"><p className="font-bold"><span className="text-3xl">🏜️</span><br></br>TripAI</p></a> 
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
            <Button className="rounded-full bg-yellow-500 hover:bg-yellow-400 border border-gray-700 text-gray-700">
             Create Trip
            </Button>
            </a>

            <a href="/my-trip">
            <Button variant="outline" className="rounded-full border border-gray-700 hover:bg-gray-200">
              My Trips
            </Button>
            </a>
         
        
          
            <Popover>
              <PopoverTrigger>
              <img
              src={user?.picture?user?.picture:'placeholder.jpg'}
              className="h-[35px] w-[35px] rounded-full"
            />
              </PopoverTrigger>
              <PopoverContent>
              <h2>{user?.given_name}</h2>
                <h2 className="cursor-pointer" onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Logout</h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={()=>setOpenDialog(true)} className="bg-gray-800">Sign In</Button>
        )}
      </div>
      <Dialog open={openDialog} className="flex justify-center items-center w-full">
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col gap-4 justify-center">
            <p className="font-bold text-gray-800">
              <span className="text-3xl">🏜️</span>TripAI</p>
              
             <p>Please sign in to continue</p> 
            </div>
          
              </DialogTitle>
          <DialogDescription>
          

            <Button
              disabled={loading}
              onClick={login}
              className="w-full mt-5 flex gap-5"
            >
              <FcGoogle className="h-5 w-5" /> Sign in with Google
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    </div>
  );
}
