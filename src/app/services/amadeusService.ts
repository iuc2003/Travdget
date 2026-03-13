/**
 * Amadeus API Integration
 * 
 * To use the real Amadeus API:
 * 1. Sign up at https://developers.amadeus.com/
 * 2. Get your API key and API secret
 * 3. Replace the credentials below
 * 4. Uncomment the real API calls and comment out mock data
 */

const AMADEUS_API_KEY = 'YOUR_AMADEUS_API_KEY';
const AMADEUS_API_SECRET = 'YOUR_AMADEUS_API_SECRET';
const AMADEUS_API_BASE = 'https://test.api.amadeus.com/v2';

export interface AmadeusFlightOption {
  id: string;
  outboundDate: string;
  returnDate: string;
  price: number;
  airline: string;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
  bookingUrl: string;
  cabinClass: string;
}

export interface AmadeusHotel {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  totalPrice: number;
  amenities: string[];
  address: string;
  imageUrl: string;
  bookingUrl: string;
}

// Airport codes mapping
function getAirportCode(destination: string): string {
  const airportCodes: Record<string, string> = {
    "Bali, Indonesia": "DPS",
    "Bangkok, Thailand": "BKK",
    "Barcelona, Spain": "BCN",
    "Budapest, Hungary": "BUD",
    "Cancún, Mexico": "CUN",
    "Cape Town, South Africa": "CPT",
    "Cusco, Peru": "CUZ",
    "Hanoi, Vietnam": "HAN",
    "Istanbul, Turkey": "IST",
    "Lisbon, Portugal": "LIS",
    "Marrakech, Morocco": "RAK",
    "Prague, Czech Republic": "PRG",
    "Rio de Janeiro, Brazil": "GIG",
    "Rome, Italy": "FCO",
    "Santorini, Greece": "JTR",
  };
  return airportCodes[destination] || "XXX";
}

function getMonthNumber(monthName: string): number {
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
  return months.indexOf(monthName) + 1;
}

// Mock flight data generator
function generateMockAmadeusFlights(
  destination: string,
  month: string,
  duration: number
): AmadeusFlightOption[] {
  const destinationCode = getAirportCode(destination);
  const monthNum = getMonthNumber(month);
  const year = 2026;
  
  const dateOptions = [
    { start: 8, label: "Option 1" },
    { start: 15, label: "Option 2" },
    { start: 22, label: "Option 3" },
  ];

  const basePrices: Record<string, number> = {
    "DPS": 880, "BKK": 750, "BCN": 470, "BUD": 400,
    "CUN": 450, "CPT": 950, "CUZ": 710, "HAN": 810,
    "IST": 550, "LIS": 430, "RAK": 510, "PRG": 380,
    "GIG": 920, "FCO": 510, "JTR": 570,
  };

  const basePrice = basePrices[destinationCode] || 520;
  const airlines = ["American Airlines", "Air France", "Iberia", "TAP Air Portugal", "Lufthansa"];

  return dateOptions.map((option, index) => {
    const outboundDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(option.start).padStart(2, '0')}`;
    const returnDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(option.start + duration).padStart(2, '0')}`;
    
    const priceVariation = index * 55 + (Math.random() * 40);
    const price = Math.round(basePrice + priceVariation);
    
    const stops = index;
    const durationHours = 9 + (stops * 3) + Math.floor(Math.random() * 3);

    return {
      id: `amadeus-flight-${index + 1}`,
      outboundDate,
      returnDate,
      price,
      airline: airlines[index % airlines.length],
      duration: `${durationHours}h ${Math.floor(Math.random() * 60)}m`,
      stops,
      departure: "JFK",
      arrival: destinationCode,
      bookingUrl: `https://www.amadeus.com/flights`,
      cabinClass: index === 0 ? "Economy" : index === 1 ? "Economy" : "Premium Economy",
    };
  }).sort((a, b) => a.price - b.price);
}

// Mock hotel data generator
function generateMockAmadeusHotels(
  destination: string,
  duration: number,
  budget: number
): AmadeusHotel[] {
  const budgetPerNight = budget / duration / 3; // Rough estimate for accommodation budget
  
  const hotelOptions = [
    {
      name: "Budget Inn Central",
      rating: 3,
      priceMultiplier: 0.7,
      amenities: ["Free WiFi", "Breakfast Included", "24/7 Reception"],
    },
    {
      name: "Comfort Hotel & Suites",
      rating: 4,
      priceMultiplier: 1.0,
      amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Room Service"],
    },
    {
      name: "Luxury Boutique Hotel",
      rating: 5,
      priceMultiplier: 1.5,
      amenities: ["Free WiFi", "Spa", "Pool", "Gym", "Restaurant", "Concierge", "Airport Transfer"],
    },
  ];

  return hotelOptions.map((hotel, index) => {
    const pricePerNight = Math.round(Math.min(budgetPerNight * hotel.priceMultiplier, budgetPerNight * 2));
    
    return {
      id: `hotel-${index + 1}`,
      name: hotel.name,
      rating: hotel.rating,
      pricePerNight,
      totalPrice: pricePerNight * duration,
      amenities: hotel.amenities,
      address: `${destination} City Center`,
      imageUrl: `https://images.unsplash.com/photo-${1566073600000 + index}`,
      bookingUrl: `https://www.amadeus.com/hotels`,
    };
  });
}

/**
 * Fetch flight options from Amadeus API
 */
export async function getAmadeusFlights(
  destination: string,
  month: string,
  duration: number
): Promise<AmadeusFlightOption[]> {
  // MOCK DATA - Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockAmadeusFlights(destination, month, duration));
    }, 1200);
  });

  /* REAL API IMPLEMENTATION (uncomment when you have credentials):
  
  const destinationCode = getAirportCode(destination);
  const monthNum = getMonthNumber(month);
  const year = new Date().getFullYear();
  const departureDate = `${year}-${String(monthNum).padStart(2, '0')}-15`;
  
  try {
    // First get access token
    const authResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
    });
    
    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    
    // Search for flights
    const response = await fetch(
      `${AMADEUS_API_BASE}/shopping/flight-offers?originLocationCode=JFK&destinationLocationCode=${destinationCode}&departureDate=${departureDate}&adults=1&max=3`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    const data = await response.json();
    
    return data.data.map((offer: any) => ({
      id: offer.id,
      outboundDate: offer.itineraries[0].segments[0].departure.at,
      returnDate: offer.itineraries[1]?.segments[0].departure.at || '',
      price: parseFloat(offer.price.total),
      airline: offer.validatingAirlineCodes[0],
      duration: offer.itineraries[0].duration,
      stops: offer.itineraries[0].segments.length - 1,
      departure: 'JFK',
      arrival: destinationCode,
      bookingUrl: 'https://www.amadeus.com/flights',
      cabinClass: offer.travelerPricings[0].fareDetailsBySegment[0].cabin,
    }));
  } catch (error) {
    console.error('Error fetching Amadeus flights:', error);
    return generateMockAmadeusFlights(destination, month, duration);
  }
  */
}

/**
 * Fetch hotel options from Amadeus API
 */
export async function getAmadeusHotels(
  destination: string,
  duration: number,
  budget: number
): Promise<AmadeusHotel[]> {
  // MOCK DATA - Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockAmadeusHotels(destination, duration, budget));
    }, 1000);
  });

  /* REAL API IMPLEMENTATION (uncomment when you have credentials):
  
  const destinationCode = getAirportCode(destination);
  
  try {
    // First get access token
    const authResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
    });
    
    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    
    // Search for hotels
    const response = await fetch(
      `${AMADEUS_API_BASE}/shopping/hotel-offers?cityCode=${destinationCode}&adults=1&radius=5&radiusUnit=KM&ratings=3,4,5`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    const data = await response.json();
    
    return data.data.slice(0, 3).map((hotel: any) => ({
      id: hotel.hotel.hotelId,
      name: hotel.hotel.name,
      rating: hotel.hotel.rating || 3,
      pricePerNight: parseFloat(hotel.offers[0].price.total),
      totalPrice: parseFloat(hotel.offers[0].price.total) * duration,
      amenities: hotel.hotel.amenities || [],
      address: hotel.hotel.address?.lines?.[0] || destination,
      imageUrl: hotel.hotel.media?.[0]?.uri || '',
      bookingUrl: 'https://www.amadeus.com/hotels',
    }));
  } catch (error) {
    console.error('Error fetching Amadeus hotels:', error);
    return generateMockAmadeusHotels(destination, duration, budget);
  }
  */
}
