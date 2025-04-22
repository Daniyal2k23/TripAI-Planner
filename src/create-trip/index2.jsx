import React, { useEffect, useState } from "react";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, BudgetData, TravelPartnerData } from "@/Datas/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/aimodels/AIModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

import axios from "axios";
import { setDoc,doc } from "firebase/firestore";

import { db } from "@/aimodels/firebaseConfig";

export default function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInput = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const generateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (formData?.noOfDays > 20 && !formData?.location) ||
      !formData?.budget ||
      !formData?.noOfTraveler
    ) {
      toast("Your data is empty just like your life!! 🕺🏼");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.noOfTraveler)
      .replace("{budget}", formData?.budget);

    //console.log(FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("AI Response:", result?.response?.text());
      setLoading(false);
      SaveTrip(result?.response?.text());
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("An error occurred while generating your trip. Please try again.");
      setLoading(false);
    }
  };

  //saving the trip into firestore

  const SaveTrip = async (trip) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    
    try {
      let parsedTrip;
      try {
        parsedTrip = JSON.parse(trip);
      } catch (parseError) {
        console.error("Error parsing trip data:", parseError);
        console.log("First 500 characters of trip data:", trip.substring(0, 500));
       //console.log("Raw trip data:", trip);

        // Attempt to identify the position of the error
      const errorMatch = parseError.message.match(/position (\d+)/);
      if (errorMatch) {
        const errorPosition = parseInt(errorMatch[1]);
        console.log("Error occurs near:", trip.substring(errorPosition - 20, errorPosition + 20));
      }
        toast("Error parsing trip data. Please try again.");
        setLoading(false);
        return;
      }

      try{
        await setDoc(doc(db, "generatedtripdata", docId), {
          userSelection: formData,
          tripData: parsedTrip,
          userEmail: user?.email,
          id: docId,
        });
  
        setLoading(false);
        toast("Trip saved successfully!");
      }catch (error) {
        console.error("Error saving trip:", error);
        toast("An error occurred while saving your trip. Please try again.");
        setLoading(false);
      }
    
      // Uncomment the following line when you're ready to navigate
      // navigate('/view-trip/' + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast("An error occurred while saving your trip. Please try again.");
      setLoading(false);
    }
  };

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("User Profile Response:", response.data);
      //  setOpenDialog(false);
      // Store user info in localStorage or state as needed
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      generateTrip();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast("Failed to fetch user profile. Please try again.");
    }
  };

  return (
    <div className="h-screen sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell Us your travel prefererence</h2>
      <p className="mt-3 text-gray-500 text-xl">just provide some info bro</p>

      <div className="mt-20 flex flex-col gap-12">
        <div>
          <h2 className="text-xl my-3 font-medium">Choose any Destination ?</h2>

          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInput("location", v);
              },
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">For how many days ?</h2>
          <Input
            placeholder="Ex. 2"
            type="number"
            onChange={(e) => handleInput("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Let us know your budget for this trip.
          </h2>
          <p>
            This way we can suggest you the exact trip which is wallet-friendly
            to you.
          </p>

          <div className="flex justify-between gap-8">
            {BudgetData.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInput("budget", item.title)}
                className={`mt-12 border rounded-md p-6 
            hover:shadow-lg cursor-pointer
            ${formData?.budget == item.title && "shadow-lg border-black"}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <h2 className="font-normal">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">How are you travelling?</h2>

          <div className="flex justify-between gap-8">
            {TravelPartnerData.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInput("noOfTraveler", item.people)}
                className={`mt-12 border rounded-md p-6 
            hover:shadow-lg cursor-pointer
             ${
               formData?.noOfTraveler == item.people && "shadow-lg border-black"
             }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <h2 className="font-normal">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Button disabled={loading} onClick={generateTrip}>
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate a trip"
          )}
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <img src="./logo.svg" />

              <Button
                disabled={loading}
                onClick={login}
                className="w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className="h-7 w-7" /> Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
