import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/aimodels/firebaseConfig";
import { chatSession } from "@/aimodels/AIModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import the data structures
import { BudgetData, TravelPartnerData, AI_PROMPT } from "@/Datas/data";

export default function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
      generateTrip();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast("Failed to fetch user profile. Please try again.");
    }
  };

  const generateTrip = async () => {
    const user = localStorage.getItem("user");
  
    if (!user) {
      setOpenDialog(true);
      return;
    }
  
    // Check if any fields are missing
    if (!formData.location || !formData.budget || !formData.noOfTraveler || !formData.noOfDays) {
      toast("Please fill in all required fields!");
      return;
    }
  
    // Check if noOfDays is greater than 5
    if (formData.noOfDays > 5) {
      toast("The number of days should be less than or equal to 5!");
      return;
    }
  
    setLoading(true);
  
    const prompt = AI_PROMPT
      .replace("{location}", formData.location.label)
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.noOfTraveler)
      .replace("{budget}", formData.budget);
  
    try {
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Remove markdown code block syntax if present
      text = text.replace(/```json\n?/, '').replace(/\n?```$/, '');
  
      // Attempt to parse the response as JSON
      let tripData;
      try {
        tripData = JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        console.log("Raw AI response:", text);
        throw new Error("Failed to parse AI response");
      }
  
      await SaveTrip(tripData);
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("An error occurred while generating your trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  
  const SaveTrip = async (trip) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    try {
      await setDoc(doc(db, "generatedtripdata", docId), {
        userSelection: formData,
        tripData: trip,
        userEmail: user?.email,
        id: docId,
      });

      toast("Trip saved successfully!");
      navigate("/view-trip/" + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast("An error occurred while saving your trip. Please try again.");
    }
  };

  return (
    <div className="flex w-full justify-between gap-8 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
  
  {/* Image Section */}
  <div className="flex-1 h-auto">
  <p className="mt-3 text-black text-2xl font-semibold -ml-16">Please provide us some details 👉🏼</p>
    <img src="/create-cover-1.svg" alt="Pattern" className="w-full -ml-52 mt-20 object-contain h-1/2" />
  </div>
  
  {/* Form Section */}
  <div className="flex-1 flex flex-col">
   

    <div className="mt-4 flex flex-col gap-8">
      <div className="flex flex-col gap-4 text-base">
        <h2 className="text-lg font-medium">Choose any Destination?</h2>
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

      <div className="flex flex-col gap-4 text-base">
        <h2 className="text-lg font-medium">For how many days?</h2>
        <Input
          placeholder="Keep it below or equal to 5 days"
          type="number"
          onChange={(e) => handleInput("noOfDays", e.target.value)}
        />
      </div>



      <div className="flex flex-col gap-4 text-base">
        <h2 className="text-lg font-medium">Let us know your budget for this trip.</h2>
      

        <div className="flex flex-col justify-between gap-2">
          {BudgetData.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInput("budget", item.title)}
              className={`p-4 border rounded-md flex items-center gap-2
                hover:shadow-lg cursor-pointer hover:bg-gray-200
                ${formData?.budget === item.title && "shadow-lg border-black"}`}
            >
              <p>{item.icon}</p>
             
              <h2 className="text-sm font-normal tracking-wide">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 text-base">
        <h2 className="text-lg font-medium">How are you travelling?</h2>

        <div className="flex flex-col justify-between gap-2">
          {TravelPartnerData.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInput("noOfTraveler", item.people)}
              className={`p-4 border rounded-md flex items-center gap-2
                hover:shadow-lg cursor-pointer hover:bg-gray-200
                ${formData?.noOfTraveler === item.people && "shadow-lg border-black"}`}
            >
             
              <p>{item.icon}</p>
              <h2 className="text-sm font-normal tracking-wide">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      
    </div>

    <div>
      <Button disabled={loading} onClick={generateTrip} className="rounded-full bg-yellow-500 hover:bg-yellow-400 border border-gray-700 text-gray-700 mt-8 mb-12">
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
          <DialogTitle>Sign in to generate your trip</DialogTitle>
          <DialogDescription>
            <img src="./logo.svg" alt="Logo" />

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
</div>


  
  );
}