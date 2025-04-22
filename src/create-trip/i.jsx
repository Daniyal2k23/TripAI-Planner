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
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/aimodels/firebaseConfig";

export default function CreateTrip() {
  const [place, setPlace] = useState();
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

    if (!formData?.location || !formData?.budget || !formData?.noOfTraveler || !formData?.noOfDays) {
        toast("Please fill in all required fields!");
        return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location?.label)
        .replace("{totalDays}", formData?.noOfDays)
        .replace("{traveler}", formData?.noOfTraveler)
        .replace("{budget}", formData?.budget);

    try {
        const result = await chatSession.sendMessage(FINAL_PROMPT);

        console.log("Raw AI Response:", result);

        let tripResponse = await result?.response?.text();
        console.log("Received AI Response:", tripResponse);

        // Clean the response to remove invalid fields like image_url
        let cleanedResponse = tripResponse
            .replace(/\/\/.*?$/gm, "") // Remove comments
            .replace(/"image_url"\s*:\s*".*?"/g, "") // Remove image_url field and value
            .trim() // Trim spaces and line breaks
            .replace(/\uFFFD/g, ""); // Remove invalid characters

        console.log("Cleaned AI Response:", cleanedResponse);

        // Check if the response is valid JSON
        if (isValidJSON(cleanedResponse)) {
            const parsedTrip = JSON.parse(cleanedResponse);
            console.log("Parsed Trip Data:", parsedTrip);
            await SaveTrip(parsedTrip); // Directly pass parsed trip
        } else {
            console.error("Received response is not valid JSON:", cleanedResponse);
            toast("An error occurred while processing the trip data.");
        }
    } catch (error) {
        console.error("Error generating trip:", error);
        toast("An error occurred while generating your trip. Please try again.");
    } finally {
        setLoading(false);
    }
};

// Helper function to check if a string is valid JSON
const isValidJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
};


  const SaveTrip = async (trip) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    // Save the trip data to Firestore
    try {
      await setDoc(doc(db, "generatedtripdata", docId), {
        userSelection: formData,
        tripData: trip, // No need to parse again
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

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("User Profile Response:", response.data);
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
      <h2 className="font-bold text-3xl">Tell Us your travel preference</h2>
      <p className="mt-3 text-gray-500 text-xl">Just provide some info</p>

      <div className="mt-20 flex flex-col gap-12">
        <div>
          <h2 className="text-xl my-3 font-medium">Choose any Destination?</h2>
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
          <h2 className="text-xl my-3 font-medium">For how many days?</h2>
          <Input
            placeholder="Ex. 2"
            type="number"
            onChange={(e) => handleInput("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">Let us know your budget for this trip.</h2>
          <p>
            This way we can suggest you the exact trip which is wallet-friendly to you.
          </p>

          <div className="flex justify-between gap-8">
            {BudgetData.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInput("budget", item.title)}
                className={`mt-12 border rounded-md p-6 
                  hover:shadow-lg cursor-pointer
                  ${formData?.budget === item.title && "shadow-lg border-black"}`}
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
                  ${formData?.noOfTraveler === item.people && "shadow-lg border-black"}`}
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
  );
}
