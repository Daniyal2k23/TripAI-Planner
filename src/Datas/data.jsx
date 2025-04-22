export const BudgetData =[
    {
        id:1,
        title:'Low-Price',
        desc:'Find Itenaries in Low Price',
        icon:'💷'
    },

    {
        id:2,
        title:'Medium-Price',
        desc:'Find Itenaries in Medium Price',
        icon:'💶'
    },

    {
        id:3,
        title:'High-Price',
        desc:'Find Itenaries in High Price',
        icon:'💵'
    }
]

export const TravelPartnerData = [
    {
        id:1,
        title:'Myself',
        desc:'Am travelling alone',
        icon:'🙋🏽‍♀️',
        people:'1 people'

    },
    {
        id:2,
        title:'Couple',
        desc:'Me and my partner',
        icon:'💍',
        people:'2 People'

    },
    
    {
        id:3,
        title:'My whole gang',
        desc:'For more than 2 people',
        icon:'👨🏽‍👩🏽‍👧🏽‍👦🏽',
        people:'3 to 6 people'

    },
    {
        id:4,
        title:'My whole gang- elderly',
        desc:'Travelling with some elder person',
        icon:'🧓🏽👵🏽',
        people:'5 to 10 people'

    }
]

export const AI_PROMPT='generate travel plan for location: {location} for {totalDays} Days for {traveler} with a {budget}, give me a hotels option list with HotelName, HotelAddress, Price,image URL, geo coordinates, rating descriptions and suggest itinerary with placename, place details, place image url, geo coordinates, ticket pricing, rating, time travel each of the location for 3 days with each day plan with best time to visit in JSON Format'