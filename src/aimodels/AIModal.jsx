import { GoogleGenerativeAI } from "@google/generative-ai";
  
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
 

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  
   export const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
   history: [
    {
      role: "user",
      parts: [
        {text: "generate travel plan for location: New york for 10 days for couple with medium pricing budget plan, give me a hotels option list with HotelName, HotelAddress, Price, image URL,geo coordinates, rating descriptions and suggest itinerary with placename, place details, place image url, geo coordinates, ticket pricing, rating, time travel each of the location for 3 days with each day plan with best time to visit in JSON Format."},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"hotels\": [\n    {\n      \"HotelName\": \"The Jane Hotel\",\n      \"HotelAddress\": \"113 Jane St, New York, NY 10014\",\n      \"Price\": \"$$$\",\n      \"geoCoordinates\": \"40.7346, -74.0048\",\n      \"rating\": \"4.5 stars\",\n      \"description\": \"A charming boutique hotel in the West Village, known for its unique history and affordable prices.\"\n    },\n    {\n      \"HotelName\": \"The Bowery Hotel\",\n      \"HotelAddress\": \"308 Bowery, New York, NY 10012\",\n      \"Price\": \"$$$$\",\n      \"geoCoordinates\": \"40.7203, -73.9977\",\n      \"rating\": \"4.0 stars\",\n      \"description\": \"A stylish and trendy hotel in the Lower East Side, with a cool, industrial vibe.\"\n    },\n    {\n      \"HotelName\": \"The Roosevelt Hotel\",\n      \"HotelAddress\": \"45 E 45th St, New York, NY 10017\",\n      \"Price\": \"$$$$\",\n      \"geoCoordinates\": \"40.7516, -73.9816\",\n      \"rating\": \"4.0 stars\",\n      \"description\": \"A historic landmark hotel in Midtown Manhattan, known for its elegant Art Deco design and convenient location.\"\n    },\n    {\n      \"HotelName\": \"The Peninsula New York\",\n      \"HotelAddress\": \"700 5th Ave, New York, NY 10019\",\n      \"Price\": \"$$$$$\",\n      \"geoCoordinates\": \"40.7580, -73.9739\",\n      \"rating\": \"4.5 stars\",\n      \"description\": \"A luxurious hotel in Midtown Manhattan, offering stunning views of Central Park and exceptional service.\"\n    }\n  ],\n  \"itinerary\": {\n    \"day1\": {\n      \"morning\": {\n        \"placeName\": \"Central Park\",\n        \"placeDetails\": \"Explore the iconic Central Park, go for a walk, have a picnic, or rent a bike. Visit the Bethesda Terrace and the Strawberry Fields.\",\n        \"geoCoordinates\": \"40.7784, -73.9671\",\n        \"ticketPricing\": \"Free\",\n        \"rating\": \"5 stars\",\n        \"timeTravel\": \"2-3 hours\"\n      },\n      \"afternoon\": {\n        \"placeName\": \"Metropolitan Museum of Art\",\n        \"placeDetails\": \"Admire world-renowned art collections from different eras and cultures.\",\n        \"geoCoordinates\": \"40.7794, -73.9632\",\n        \"ticketPricing\": \"Suggested donation\",\n        \"rating\": \"4.8 stars\",\n        \"timeTravel\": \"3-4 hours\"\n      },\n      \"evening\": {\n        \"placeName\": \"Times Square\",\n        \"placeDetails\": \"Experience the dazzling lights and bustling atmosphere of Times Square.\",\n        \"geoCoordinates\": \"40.7580, -73.9855\",\n        \"ticketPricing\": \"Free\",\n        \"rating\": \"4.0 stars\",\n        \"timeTravel\": \"1-2 hours\"\n      }\n    },\n    \"day2\": {\n      \"morning\": {\n        \"placeName\": \"Statue of Liberty and Ellis Island\",\n        \"placeDetails\": \"Take a ferry to Liberty Island and Ellis Island to see the iconic Statue of Liberty and learn about the history of immigration to America.\",\n        \"geoCoordinates\": \"40.6892, -74.0445\",\n        \"ticketPricing\": \"Ferry tickets required\",\n        \"rating\": \"4.5 stars\",\n        \"timeTravel\": \"4-5 hours\"\n      },\n      \"afternoon\": {\n        \"placeName\": \"Brooklyn Bridge\",\n        \"placeDetails\": \"Walk or bike across the iconic Brooklyn Bridge for stunning views of the Manhattan skyline.\",\n        \"geoCoordinates\": \"40.7028, -73.9972\",\n        \"ticketPricing\": \"Free\",\n        \"rating\": \"4.5 stars\",\n        \"timeTravel\": \"2-3 hours\"\n      },\n      \"evening\": {\n        \"placeName\": \"Little Italy\",\n        \"placeDetails\": \"Enjoy delicious Italian food and experience the vibrant atmosphere of Little Italy.\"\n        \"geoCoordinates\": \"40.7188, -73.9973\",\n        \"ticketPricing\": \"Free\",\n        \"rating\": \"4.0 stars\",\n        \"timeTravel\": \"2-3 hours\"\n      }\n    },\n    \"day3\": {\n      \"morning\": {\n        \"placeName\": \"The High Line\",\n        \"placeDetails\": \"Walk along this elevated park built on a former railway line, enjoying unique urban views.\",\n        \"geoCoordinates\": \"40.7487, -74.0036\",\n        \"ticketPricing\": \"Free\",\n        \"rating\": \"4.5 stars\",\n        \"timeTravel\": \"1-2 hours\"\n      },\n      \"afternoon\": {\n        \"placeName\": \"Chelsea Market\",\n        \"placeDetails\": \"Browse a variety of food vendors, artisanal shops, and unique restaurants.\",\n        \"geoCoordinates\": \"40.7414, -74.0062\",\n        \"ticketPricing\": \"Free\",\n        \"rating\": \"4.0 stars\",\n        \"timeTravel\": \"2-3 hours\"\n      },\n      \"evening\": {\n        \"placeName\": \"Top of the Rock\",\n        \"placeDetails\": \"Experience panoramic views of New York City from the observation deck of the Rockefeller Center.\"\n        \"geoCoordinates\": \"40.7580, -73.9786\",\n        \"ticketPricing\": \"Admission required\",\n        \"rating\": \"4.8 stars\",\n        \"timeTravel\": \"1-2 hours\"\n      }\n    }\n  }\n}\n```"},
      ],
    },
  ],
    });
  
 
  
  
